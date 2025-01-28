<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function index()
    {
        $payments = Payment::latest()->with(['ticket', 'user'])->where(function ($i) {
            $search = request('search');

            if ($search) {
                return $i->where('payment_date', 'like', "%$search%");
            }
        })->get();

        return response()->json([
            'payments' => $payments,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ticket_id' => ['required'],
            'user_id' => ['required'],
            'payment_date' => ['required'],
            'price' => ['required'],
            'status' => ['required'],
        ]);

        $payment = Payment::create($validated);

        return response()->json([
            'payment' => $payment
        ]);
    }

    public function update(Request $request, $id)
    {
        $payment = Payment::find($id);

        $request->validate([
            'ticket_id' => ['required'],
            'user_id' => ['required'],
            'payment_date' => ['required'],
            'price' => ['required'],
            'status' => ['required'],
        ]);

        $payment->update([
            'ticket_id' => $request->ticket_id,
            'user_id' => $request->user_id,
            'payment_date' => $request->payment_date,
            'price' => $request->price,
            'status' => $request->status,
        ]);

        return response()->json([
            'payment' => $payment,
        ]);
    }

    public function destroy($id)
    {
        Payment::destroy($id);

        return response()->json([
            'status' => 'Payment deleted',
        ]);
    }
}