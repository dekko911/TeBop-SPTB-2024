<?php

namespace App\Http\Controllers;

use App\Enums\CheckStatus;
use App\Models\Seat;
use Illuminate\Http\Request;
use Illuminate\Validation\Rules\Enum;
use Illuminate\Validation\ValidationException;

class SeatController extends Controller
{
    public function index()
    {
        $seats = Seat::latest()->with(['show'])->where(function ($i) {
            $search = request('search');

            if ($search) {
                return $i->whereAny(['seat_number', 'seat_status'], 'like', "%$search%")->orWhereRelation('show', 'showtime', 'like', "%$search%");
            }
        })->get();

        // $statusColor = $seat->seat_status->color();

        return response()->json([
            'seats' => $seats,
            // 'seat_status_color' => $statusColor,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'show_id' => ['required'],
            'seat_number' => ['required'],
            'seat_status' => ['required', new Enum(CheckStatus::class)],
        ]);

        $status = $request->enum('seat_status', CheckStatus::class);

        $seat = Seat::create([
            'show_id' => $request->show_id,
            'seat_number' => $request->seat_number,
            'seat_status' => $status,
        ]);

        return response()->json([
            'seat' => $seat,
        ]);
    }

    public function update(Request $request, $id)
    {
        $seat = Seat::find($id);

        $request->validate([
            'show_id' => ['required'],
            'seat_number' => ['required'],
        ]);

        $status = $request->enum('seat_status', CheckStatus::class);

        $seat->update([
            'show_id' => $request->show_id,
            'seat_number' => $request->seat_number,
        ]);

        if ($request->seat_status) {
            $seat->update([
                'seat_status' => $status
            ]);
        }

        return response()->json([
            'seat' => $seat,
        ]);
    }

    public function destroy($id)
    {
        Seat::destroy($id);

        return response()->json([
            'status' => 'Seat deleted',
        ]);
    }
}
