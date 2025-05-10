<?php

namespace App\Http\Controllers;

use App\Models\Show;
use Illuminate\Http\Request;

class ShowController extends Controller
{
    public function index()
    {
        $shows = Show::latest()->with(['movie', 'studio'])->where(function ($i) {
            $search = request('search');

            if ($search) {
                return $i->where('showtime', 'like', "%$search%")->orWhereRelation('studio', 'studio', 'like', "%$search%")->orWhereRelation('movie', 'title', 'like', "%$search%");
            }
        })->get();

        return response()->json([
            'shows' => $shows,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'movie_id' => ['required'],
            'studio_id' => ['required'],
            'showtime' => ['required'],
        ]);

        $show = Show::create($validated);

        return response()->json([
            'show' => $show,
        ]);
    }

    public function update(Request $request, $id)
    {
        $show = Show::find($id);

        $request->validate([
            'movie_id' => ['required'],
            'studio_id' => ['required'],
            'showtime' => ['required'],
        ]);

        $show->update([
            'movie_id' => $request->movie_id,
            'studio_id' => $request->studio_id,
            'showtime' => $request->showtime,
        ]);

        return response()->json([
            'show' => $show,
        ]);
    }

    public function destroy($id)
    {
        Show::destroy($id);

        return response()->json([
            'status' => 'Show deleted',
        ]);
    }
}
