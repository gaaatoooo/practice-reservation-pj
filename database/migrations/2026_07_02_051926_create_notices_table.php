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
        Schema::create('notices', function (Blueprint $table) {
            $table->id();
            $table->string('title')->comment('お知らせタイトル');
            $table->text('content')->comment('お知らせ本文');
            $table->integer('category')->default(1)->comment('カテゴリ(1=重要, 2=イベント, 3=案内)');
            $table->integer('status')->default(1)->comment('ステータス(1=下書き, 2=公開, 3=非公開)');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notices');
    }
};
