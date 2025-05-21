<?php

namespace App\Http\Controllers;

use App\Models\Genre;
use Illuminate\Http\Request;

class GenreController extends Controller
{
    public function index()
    {
        $genres = Genre::oldest()->where(function ($i) {
            $search = request('search');

            if ($search) {
                return $i->where('genre', 'like', "%$search%");
            }
        })->get();

        return response()->json([
            'genres' => $genres,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'genre' => ['required'],
        ]);

        $genre = Genre::create($validated);

        return response()->json([
            'genre' => $genre,
        ]);
    }

    public function destroy($id)
    {
        Genre::destroy($id);

        return response()->json([
            'status' => 'Genre deleted',
        ]);
    }
}