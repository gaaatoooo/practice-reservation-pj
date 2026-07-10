<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Reservation extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'user_id',
        'room_id',
        'plan_id',
        'reservation_start_date',
        'reservation_end_date',
        'number',
        'total_price',
        'status',
        'admin_memo', 
        'guest_name',
        'guest_tel',
        'guest_zip',
        'guest_address',
        'guest_birthday',
        'guest_email',
        'cancel_date',
    ];

    public function room()
    {
        return $this->belongsTo(Room::class, 'room_id');
    }

    // 予約データから、紐づく「宿泊プラン（Plan）」のデータを自動取得するための設定
    public function plan()
    {
        return $this->belongsTo(Plan::class, 'plan_id');
    }

    /**
     * 予約に紐づくユーザー（宿泊客）の情報を取得
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
