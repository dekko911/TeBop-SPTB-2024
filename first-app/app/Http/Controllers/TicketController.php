<?php

namespace App\Http\Controllers;

use App\Models\Ticket;
use Illuminate\Http\Request;

class TicketController extends Controller
{
    public function index()
    {
        $tickets = Ticket::latest()->with(['seat', 'user', 'movie'])->where(function ($i) {
            $search = request('search');

            if ($search) {
                return $i->where('code_ticket', 'like', "%$search%");
            }
        })->get();

        return response()->json([
            'tickets' => $tickets,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'seat_id' => ['required'],
            'user_id' => ['required'],
            'movie_id' => ['required'],
            'code_ticket' => ['required'],
            'purchase_date' => ['required'],
        ]);

        $ticket = Ticket::create($validated);

        return response()->json([
            'ticket' => $ticket,
        ]);
    }

    public function update(Request $request, $id)
    {
        $ticket = Ticket::find($id);

        $request->validate([
            'seat_id' => ['required'],
            'user_id' => ['required'],
            'movie_id' => ['required'],
            'code_ticket' => ['required'],
            'purchase_date' => ['required'],
        ]);

        $ticket->update([
            'seat_id' => $request->seat_id,
            'user_id' => $request->user_id,
            'movie_id' => $request->movie_id,
            'code_ticket' => $request->code_ticket,
            'purchase_date' => $request->purchase_date,
        ]);

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