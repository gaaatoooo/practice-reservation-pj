<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('restaurant_reservations', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id')->comment('ユーザーID');
            $table->integer('restaurant_stock_id')->comment('レストラン在庫ID');
            $table->integer('number')->comment('予約人数');
            $table->date('reservation_date')->comment('予約日');
            $table->time('reservation_time')->comment('予約時間');
            $table->integer('status')->default(1)->comment('1:予約中, 2:キャンセル済み');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('restaurant_reservations');
    }
};