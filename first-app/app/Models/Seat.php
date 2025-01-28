<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Seat extends Model
{
    use HasFactory;

    protected $fillable = [
        'show_id',
        'seat_number',
        'seat_status',
    ];

    public function tickets() // with(['tickets'])
    {
        return $this->hasMany(Ticket::class, 'seat_id', 'id');
    }

    public function show() // with(['show'])
    {
        return $this->belongsTo(Show::class, 'show_id', 'id');
    }
}