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

        $seat = Seat::findOrFail($request->__get('seat_id'));

        if (Auth::user()->tokenCan('admin')) {
            $userId = $request->__get('user_id');
        } else if (Auth::user()->tokenCan('user')) {
            $userId = Auth::id();
        }

        $ticket = Ticket::create([
            'seat_id' => $request->__get('seat_id'),
            'user_id' => $userId,
            'movie_id' => $request->__get('movie_id'),
            'code_ticket' => $request->__get('code_ticket'),
            'purchase_date' => $request->__get('purchase_date'),
        ]);

        if ($request->__get('seat_id')) {
            $seat->update([
                'show_id' => $seat->__get('show_id'),
                'seat_number' => (string) $seat->__get('seat_number'),
                'seat_status' => CheckStatus::NOT_AVAILABLE->value,
            ]);
        }

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
