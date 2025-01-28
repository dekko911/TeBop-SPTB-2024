<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Movie extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'genre_id',
        'duration',
        'release_date',
    ];

    public function shows() // with(['shows'])
    {
        return $this->hasMany(Show::class, 'movie_id', 'id');
    }

    public function tickets() // with(['tickets'])
    {
        return $this->hasMany(Ticket::class, 'movie_id', 'id');
    }

    public function genre() // with(['genre'])
    {
        return $this->belongsTo(Genre::class, 'genre_id', 'id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}