<?php

namespace App\Models;

use App\Enums\CheckStatus;
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

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts()
    {
        return [
            'seat_status' => CheckStatus::class,
        ];
    }

    public function tickets() // with(['tickets'])
    {
        return $this->hasMany(Ticket::class, 'seat_id', 'id');
    }

    public function show() // with(['show'])
    {
        return $this->belongsTo(Show::class, 'show_id', 'id');
    }
}
