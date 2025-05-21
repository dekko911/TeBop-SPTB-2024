<?php

namespace App\Http\Controllers;

use App\Models\Movie;
use Illuminate\Http\Request;

class MovieController extends Controller
{
    public function index()
    {
        $movies = Movie::latest()->with(['genre'])->where(function ($i) {
            $search = request('search');

            if ($search) {
                return $i->where('title', 'like', "%$search%")->orWhereRelation('genre', 'genre', 'like', "%$search%")->orWhere('release_date', 'like', "%$search%");
            }
        })->get();

        return response()->json([
            'movies' => $movies,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => ['required'],
            'genre_id' => ['required'],
            'duration' => ['required'],
            'release_date' => ['required'],
        ]);

        $movie = Movie::create($validated);

        return response()->json([
            'movie' => $movie,
        ]);
    }

    public function update(Request $request, $id)
    {
        $movie = Movie::find($id);

        $request->validate([
            'title' => ['required'],
            'genre_id' => ['required'],
            'duration' => ['required'],
            'release_date' => ['required'],
        ]);

        $movie->update([
            'title' => $request->title,
            'genre_id' => $request->genre_id,
            'duration' => $request->duration,
            'release_date' => $request->release_date,
        ]);

        return response()->json([
            'movie' => $movie,
        ]);
    }

    public function destroy($id)
    {
        Movie::destroy($id);

        return response()->json([
            'status' => 'Movie deleted',
        ]);
    }
}