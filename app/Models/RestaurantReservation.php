<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class RestaurantReservation extends Model
{
    protected $fillable = [
        'user_id',
        'restaurant_stock_id',
        'number',
        'reservation_date',
        'reservation_time',
        'status',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * この予約が紐づく予約枠（在庫）
     */
    public function restaurantStock(): BelongsTo
    {
        return $this->belongsTo(RestaurantStock::class);
    }
}
