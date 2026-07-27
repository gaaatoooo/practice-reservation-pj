<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HotelDetail extends Model
{
    protected $fillable = [
        'postal_code',
        'address',
        'tel',
        'email',
        'check_in_time',
        'check_out_time',
        'description',
        'amenities',
        'access_info',
        'child_policy',
        'parking_info',
        'cancel_policy',
    ];
}