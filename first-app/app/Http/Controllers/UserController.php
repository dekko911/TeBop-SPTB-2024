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
                return $i->where('name', 'like', "%$this->search%")
                    ->orWhere('email', 'like', "%$this->search%")
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
            'profile' => ['nullable', 'file', 'mimes:png,jpg']
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
            'profile' => $filename ?? null
        ]);

        if ($user['name'] === 'admin') {
            throw new \Exception("Admin Can't Created !", 422);
        }

        return response()->json([
            'user' => $user,
            'message' => 'User created !',
        ]);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if ($user['id'] === 1) {
            return response()->json([
                'status' => 'error',
            ]);
        }

        $request->validate([
            'name' => ['required'],
            'email' => ['required'],
        ]);

        // if ($request->file('profile')) {
        //     if ($request->old('profile')) {
        //         Storage::delete('users/profile/' . $request->old('profile'));
        //     }
        //     $extension = $request->file('profile')->extension();
        //     $filename = Str::random(20) . '.' . $extension;

        //     $request->file('profile')->storeAs('users/profile', $filename, 'public');
        // }

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
        ]);

        if ($request->password) {
            $user->update(['password' => $request->password]);
        }

        return response()->json([
            'user' => $user,
            'status' => 'success'
        ]);
    }

    public function destroy(User $user)
    {
        if ($user->profile) {
            Storage::delete('users/profile/' . $user->profile);
        }

        if ($user['id'] === 1) {
            return response()->json([
                'status' => 'forbidden',
            ]);
        }

        User::destroy($user->id);

        return response()->json([
            'status' => 'User deleted',
        ]);
    }
}