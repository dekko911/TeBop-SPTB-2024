<?php

namespace App\Models;

use Carbon\Carbon;
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

    protected $appends = ['payment_date_iso'];

    public function getPaymentDateIsoAttribute(): string
    {
        return Carbon::parse($this->__get('payment_date'))->isoFormat('DD MMMM YYYY, HH:mm');
    }

    public function ticket() // with(['ticket'])
    {
        return $this->belongsTo(Ticket::class, 'ticket_id', 'id');
    }

    public function user() // with(['user'])
    {
        return $this->belongsTo(User::class, 'user_id', 'id');
    }
}
