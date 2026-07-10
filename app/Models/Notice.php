<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notice extends Model
{
    protected $fillable = [
        'title',
        'content',
        'category',
        'status',
        'public_start_date',
        'public_end_date',
    ];
}
