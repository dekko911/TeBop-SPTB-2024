<?php

namespace App\Http\Controllers;

use App\Models\Role;
use Illuminate\Http\Request;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::oldest()->with(['user'])->where(function ($i) {
            $search = request('search');

            if ($search) {
                return $i->where('name', 'like', "%$search%")->orWhereRelation('user', 'name', 'like', "%$search%");
            }
        })->get();

        return response()->json([
            'roles' => $roles,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => ['required'],
            'name' => ['required'],
        ]);

        if ($validated['name'] == 'admin' && $validated['user_id'] == 1) {
            return response()->json([
                'message' => 'Nama Role Tidak Boleh Bernama Admin.',
            ], 422);
        }

        $role = Role::create($validated);

        return response()->json([
            'role' => $role
        ]);
    }

    public function destroy($id)
    {
        Role::destroy($id);

        return response()->json([
            'status' => 'Role deleted',
        ]);
    }
}
