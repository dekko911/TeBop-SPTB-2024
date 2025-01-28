<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'ticket_id',
        'user_id',
        'payment_date',
        'price',
        'status',
    ];

    public function ticket() // with(['ticket'])
    {
        return $this->belongsTo(Ticket::class, 'ticket_id', 'id');
    }

    public function user() // with(['user'])
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}