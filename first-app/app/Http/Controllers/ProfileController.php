<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    public function show()
    {
        $user = Auth::user();
        $roles = $user->roles->pluck('name')->all();

        // if ($roles != "admin") {
        //     return response()->json([
        //         'status' => 'forbidden',
        //         'message' => 'You are not allowed to access this page.'
        //     ]);
        // }

        return response()->json([
            'status' => 'success',
            'user' => $user,
            'abilities' => $roles
        ]);

        // this thing likes a backup, if you use it, sometimes it will work, maybe.
    }
}