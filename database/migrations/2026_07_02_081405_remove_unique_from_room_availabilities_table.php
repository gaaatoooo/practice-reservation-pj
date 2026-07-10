<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('room_availabilities', function (Blueprint $table) {
            // ⭕️ room_id と date の複合ユニーク制約をデータベースから削除
            $table->dropUnique(['room_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('room_availabilities', function (Blueprint $table) {
            // ロールバック（元に戻す）時のために、再度ユニーク制約を張る記述を用意
            $table->unique(['room_id', 'date']);
        });
    }
};
