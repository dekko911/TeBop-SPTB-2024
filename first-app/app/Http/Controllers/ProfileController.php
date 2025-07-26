<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    public function show()
    {
        $user = Auth::user();
        $token = Auth::authenticate()->accessToken;

        return response()->json([
            'status' => 'success',
            'user' => $user,
            'accessToken' => $token,
        ]);

        // this thing like a backup, if you use it, sometimes it will work, maybe.
    }
}
