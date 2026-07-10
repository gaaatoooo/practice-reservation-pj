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
        Schema::create('fairs', function (Blueprint $table) {
            $table->id();
            $table->string('title')->comment('フェアのタイトル');
            $table->text('description')->comment('フェアの説明文');
            $table->string('image_url')->nullable()->comment('画像パス');
            $table->boolean('status')->default(true)->comment('公開ステータス');
            $table->integer('sort_order')->default(0)->comment('表示順序');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fairs');
    }
};
