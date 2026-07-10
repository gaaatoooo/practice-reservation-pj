<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            // ⭕️ 別予約者用のカラムをすべて nullable（空欄OK）で追加
            $table->string('guest_name')->nullable()->after('status')->comment('別予約者・氏名');
            $table->string('guest_tel')->nullable()->after('guest_name')->comment('別予約者・電話番号');
            $table->string('guest_zip')->nullable()->after('guest_tel')->comment('別予約者・郵便番号');
            $table->string('guest_address')->nullable()->after('guest_zip')->comment('別予約者・住所');
            $table->date('guest_birthday')->nullable()->after('guest_address')->comment('別予約者・生年月日');
        });
    }

    public function down(): void
    {
        Schema::table('reservations', function (Blueprint $table) {
            $table->dropColumn(['guest_name', 'guest_tel', 'guest_zip', 'guest_address', 'guest_birthday']);
        });
    }
};
