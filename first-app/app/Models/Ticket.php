<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = [
        'seat_id',
        'user_id',
        'movie_id',
        'code_ticket',
        'purchase_date',
    ];

    public function payments() // with(['payments'])
    {
        return $this->hasMany(Payment::class, 'ticket_id', 'id');
    }

    public function seat() // with(['seat'])
    {
        return $this->belongsTo(Seat::class, 'seat_id', 'id');
    }

    public function user() // with(['user'])
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }

    public function movie() // with(['movie'])
    {
        return $this->belongsTo(Movie::class, 'movie_id', 'id');
    }
}