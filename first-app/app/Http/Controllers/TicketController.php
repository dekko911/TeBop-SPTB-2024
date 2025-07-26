<?php

namespace App\Http\Controllers;

use App\Enums\CheckStatus;
use App\Models\Seat;
use App\Models\Ticket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class TicketController extends Controller
{
    public function index()
    {
        $tickets = Ticket::latest()->with(['seat', 'user', 'movie'])->where(function ($i) {
            $search = request('search');

            if ($search) {
                return $i->where('code_ticket', 'like', "%$search%")->orWhereRelation('seat', 'seat_number', 'like', "%$search%")->orWhereRelation('user', 'name', 'like', "%$search%")->orWhereRelation('movie', 'title', 'like', "%$search%");
            }
        })->get();

        return response()->json([
            'tickets' => $tickets,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'seat_id' => ['required'],
            'movie_id' => ['required'],
            'code_ticket' => ['required'],
            'purchase_date' => ['required'],
        ]);

        // INI BELUM SELESAI YA
        $seat = Seat::findOrFail($request->seat_id);

        // BELUM DAPAT CARA NYA, BIAR DAPAT ROLE NYA
        if (Auth::user()->id === 1) {
            $status = $seat->seat_status;

            if ($status === CheckStatus::AVAILABLE) {
                $status = CheckStatus::NOT_AVAILABLE;
            }

            $ticket = Ticket::create([
                'seat_id' => $request->seat_id,
                'user_id' => $request->user_id,
                'movie_id' => $request->movie_id,
                'code_ticket' => $request->code_ticket,
                'purchase_date' => $request->purchase_date,
            ]);

            if ($request->seat_id) {
                $seat->update([
                    'show_id' => $seat->show_id,
                    'seat_number' => (string) $seat->seat_number,
                    'seat_status' => $status,
                ]);
            }
        } else {
            $status = $seat->seat_status;

            if ($status === CheckStatus::AVAILABLE) {
                $status = CheckStatus::NOT_AVAILABLE;
            }

            $ticket = Ticket::create([
                'seat_id' => $request->seat_id,
                'user_id' => Auth::id(),
                'movie_id' => $request->movie_id,
                'code_ticket' => $request->code_ticket,
                'purchase_date' => $request->purchase_date,
            ]);

            if ($request->seat_id) {
                $seat->update([
                    'show_id' => $seat->show_id,
                    'seat_number' => (string) $seat->seat_number,
                    'seat_status' => $status,
                ]);
            }
        }
        // BANGSAT

        return response()->json([
            'ticket' => $ticket,
            'seat' => $seat,
        ]);
    }

    public function update(Request $request, $id)
    {
        $ticket = Ticket::find($id);

        $validated = $request->validate([
            'seat_id' => ['required'],
            'user_id' => ['required'],
            'movie_id' => ['required'],
            'code_ticket' => ['required'],
            'purchase_date' => ['required'],
        ]);

        $ticket->update($validated);

        return response()->json([
            'ticket' => $ticket,
        ]);
    }

    public function destroy($id)
    {
        Ticket::destroy($id);

        return response()->json([
            'status' => 'Ticket deleted',
        ]);
    }
}
