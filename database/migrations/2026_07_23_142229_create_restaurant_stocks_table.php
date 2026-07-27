<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('restaurant_stocks', function (Blueprint $table) {
            $table->id();
            $table->date('date')->comment('予約可能日');
            $table->time('time')->comment('予約可能時間');
            $table->unsignedInteger('capacity')->comment('受入可能人数');
            $table->timestamps();

            // 同じ日付・時間の枠を重複して作れないようにする
            $table->unique(['date', 'time']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('restaurant_stocks');
    }
};