<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Room extends Model
{
    /**
     * ⭕️ リレーション定義：このお部屋に紐づく口コミ一覧を取得
     */
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }
    
    protected $fillable = [
        'name',
        'description',
        'url',
        'image_url',
        'price',
        'capacity',
        'status',
        'total_rooms'
    ];
}
