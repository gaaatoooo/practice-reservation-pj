<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RestaurantStock extends Model
{
    protected $fillable = [
        'date',
        'time',
        'capacity',
    ];
}
