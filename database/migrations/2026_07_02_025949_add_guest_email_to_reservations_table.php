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
        Schema::table('reservations', function (Blueprint $table) {
            // ⭕️ guest_name の後ろに guest_email を nullable（空欄OK）で安全に追加します
            $table->string('guest_email')->nullable()->after('guest_name')->comment('別予約者・メールアドレス');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropColumn('guest_email');
        });
    }
};
