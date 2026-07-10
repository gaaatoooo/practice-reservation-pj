<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id')->comment('ユーザーID');
            $table->integer('room_id')->comment('部屋ID');
            $table->integer('plan_id')->comment('プランID');
            // 口コミデータ
            $table->integer('rating')->comment('評価'); // 星1〜5
            $table->text('comment')->comment('本文');   // 口コミ本文
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
