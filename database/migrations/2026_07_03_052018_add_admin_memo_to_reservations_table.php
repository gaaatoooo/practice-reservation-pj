<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reservations', function (Blueprint $blueprint) {
            // 管理スタッフ用のテキストメモ欄を追加（空を許容）
            $blueprint->text('admin_memo')->nullable()->after('status')->comment('管理スタッフ用のメモ欄。予約の特記事項や内部連絡用に使用。');
        });
    }

    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $blueprint) {
            $blueprint->dropColumn('admin_memo');
        });
    }
};
