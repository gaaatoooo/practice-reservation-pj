<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'email',
        'content',
        'type',
        'is_replied',
        'target_id',
    ];

    /**
     * ⭕️ 自己リレーション：このお問合せに対する「返信対象（親のお問合せ）」を取得
     */
    public function target(): BelongsTo
    {
        // 第2引数には、実際のテーブルで親IDを保持しているカラム名（例: parent_id）を指定してください
        return $this->belongsTo(Contact::class, 'target_id');
    }
}
