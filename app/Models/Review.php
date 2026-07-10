<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Review extends Model
{
    protected $fillable = [
        'user_id',
        'room_id',
        'plan_id',
        'rating',
        'comment',
    ];

    /**
     * ⭕️ リレーション：この口コミが投稿された「お部屋」を取得
     */
    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    /**
     * ⭕️ リレーション：この口コミで利用された「宿泊プラン」を取得
     */
    public function plan(): BelongsTo
    {
        return $this->belongsTo(Plan::class);
    }

    /**
     * ⭕️ リレーション：この口コミを投稿した「ユーザー」を取得
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
