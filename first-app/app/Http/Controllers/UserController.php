<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        $users = User::oldest()->with(['roles'])->where(function ($i) {
            $search = request('search');

            if ($search) {
                return $i->where('name', 'like', "%$search%")->orwhere('email', 'like', "%$search%");
            }
        })->get();

        return response()->json([
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => ['required'],
                'email' => ['required'],
                'password' => ['required'],
            ]);

            $user = User::create($validated);

            return response()->json([
                'user' => $user,
            ]);
        } catch (\Exception) {
            // bagian ini tidak bisa di show ke halaman user, hanya bisa terlihat di log, kecuali kalau bisa di tangkap dari method catch yang ada di frontend
            return response()->json([
                'message' => 'Email already exists.',
            ], 422);
        }
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);

        $request->validate([
            'name' => ['required'],
            'email' => ['required', 'unique:users,email,' . $user->id],
            'password' => ['required'],
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
        ]);

        return response()->json([
            'user' => $user,
        ]);
    }

    public function destroy($id)
    {
        User::destroy($id);

        return response()->json([
            'status' => 'User deleted',
        ]);
    }
}