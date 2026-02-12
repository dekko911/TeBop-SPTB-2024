<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class PaymentController extends Controller
{
    public function index()
    {
        $payments = Payment::latest()->with(['ticket', 'user'])->where(function ($i) {
            $search = request('search');

            if ($search) {
                return $i->whereAny(['payment_date', 'price', 'status'], 'like', "%$search%")->orWhereRelation('ticket', 'code_ticket', 'like', "%$search%")->orWhereRelation('user', 'name', 'like', "%$search%");
            }
        })->get();

        return response()->json([
            'payments' => $payments,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'ticket_id' => ['required'],
            'payment_date' => ['required'],
            'price' => ['required'],
            'status' => ['required'],
        ]);

        if (Auth::user()->tokenCan('admin')) {
            $userId = $request->__get('user_id');
        } else if (Auth::user()->tokenCan('user')) {
            $userId = Auth::id();
        }

        $payment = Payment::create([
            'ticket_id' => $request->__get('ticket_id'),
            'user_id' => $userId,
            'payment_date' => $request->__get('payment_date'),
            'price' => $request->__get('price'),
            'status' => $request->__get('status'),
        ]);

        return response()->json([
            'payment' => $payment
        ]);
    }

    public function update(Request $request, $id)
    {
        $payment = Payment::find($id);

        $validated = $request->validate([
            'ticket_id' => ['required'],
            'user_id' => ['required'],
            'payment_date' => ['required'],
            'price' => ['required'],
            'status' => ['required'],
        ]);

        $payment->update($validated);

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
