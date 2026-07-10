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
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade')->comment('顧客ID');
            $table->foreignId('room_id')->constrained()->onDelete('cascade')->comment('部屋ID');
            $table->foreignId('plan_id')->constrained()->onDelete('cascade')->comment('プランID');
            $table->date('reservation_start_date')->comment('宿泊開始日');
            $table->date('reservation_end_date')->comment('宿泊終了日');
            $table->integer('number')->comment('宿泊人数');
            $table->integer('total_price')->comment('合計金額');
            $table->integer('status')->default(1)->comment('予約ステータス');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
