<?php

namespace App\Models;

use Carbon\Carbon;
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

    protected $appends = ['duration_iso', 'release_date_iso'];

    public function getDurationIsoAttribute(): string
    {
        return Carbon::parse($this->__get('duration'))->isoFormat('HH:mm');
    }

    public function getReleaseDateIsoAttribute(): string
    {
        return Carbon::parse($this->__get('release_date'))->isoFormat('DD MMMM YYYY');
    }

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
