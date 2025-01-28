<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Show extends Model
{
    use HasFactory;

    protected $fillable = [
        'movie_id',
        'studio_id',
        'showtime',
    ];

    public function seats() // with(['seats'])
    {
        return $this->hasMany(Seat::class, 'show_id', 'id');
    }

    public function movie() // with(['movie'])
    {
        return $this->belongsTo(Movie::class, 'movie_id', 'id');
    }

    public function studio() // with(['studio'])
    {
        return $this->belongsTo(Studio::class, 'studio_id', 'id');
    }
}