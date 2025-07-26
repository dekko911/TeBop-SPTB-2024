<?php

namespace App\Enums;

enum CheckStatus: string
{
    case AVAILABLE = 'Available';
    case NOT_AVAILABLE = 'Not Available';

    // public function color(): string
    // {
    //     return match ($this) {
    //         self::AVAILABLE => 'green',
    //         self::NOT_AVAILABLE => 'red',
    //     };
    // }
}

/*
    {
        name: AVAILABLE,
        value: Available
    }
*/
