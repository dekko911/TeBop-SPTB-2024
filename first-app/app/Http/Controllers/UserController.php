<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UserController extends Controller
{
    protected $search;

    public function __construct()
    {
        $this->search = request('search');
    }

    public function index()
    {
        $users = User::oldest()->with(['roles'])->where(function ($i) {
            if ($this->search) {
                return $i->whereAny(['name', 'email'], 'like', "%$this->search%")
                    ->orWhereRelation('roles', 'name', 'like', "%$this->search%");
            }
        })->get();

        return response()->json([
            'users' => $users,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => ['required'],
            'email' => ['required'],
            'password' => ['required'],
            'profile' => ['nullable', 'mimes:png,jpg,webp,gif', 'max:1024'],
        ]);

        if ($request->file('profile')) {
            $extension = $request->file('profile')->extension();
            $filename = Str::random(20) . '.' . $extension;

            $request->file('profile')->storeAs('users/profile', $filename, 'public');
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => $request->password,
            'profile' => $filename ?? '-',
        ]);

        return response()->json([
            'user' => $user,
            'message' => 'User created !',
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);

        $request->validate([
            'name' => ['required'],
            'email' => ['required'],
            'profile' => ['mimes:png,jpg,webp,gif', 'max:1024'],
        ]);

        if ($user->id === 1) {
            throw new \Exception('LO GA BOLEH DI EDIT');
        }

        if ($request->file('profile')) {
            if ($user->profile) {
                Storage::disk('public')->delete("users/profile/$user->profile");
            }

            $extension = $request->file('profile')->extension();
            $filename = Str::random(20) . '.' . $extension;

            $request->file('profile')->storeAs('users/profile', $filename, 'public');
        }

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        if ($request->password) {
            $user->update(['password' => $request->password]);
        }

        if ($request->profile) {
            $user->update(['profile' => $filename]);
        }

        return response()->json([
            'user' => $user,
            'status' => 'success'
        ]);
    }

    public function destroy(User $user)
    {
        if ($user->profile) {
            Storage::disk('public')->delete("users/profile/$user->profile");
        }

        if ($user['id'] === 1) {
            throw new \Exception('LO GA BOLEH KE HAPUS');
        }

        User::destroy($user->id);

        return response()->json([
            'status' => 'User deleted',
        ]);
    }
}
