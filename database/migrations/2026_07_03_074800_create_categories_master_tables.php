<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * マイグレーションの実行（テーブル作成）
     */
    public function up(): void
    {
        // 1. お知らせカテゴリマスタテーブル
        Schema::create('notice_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50)->comment('カテゴリ名'); // カテゴリ名（最大50文字）
            $table->integer('status')->comment('ステータス（1:公開、2:非公開）')->default(1); // ステータス（1:公開、2:非公開）
            $table->timestamps();
        });

        // 2. フェアカテゴリマスタテーブル（次で使うため一緒に作成します）
        Schema::create('fair_categories', function (Blueprint $table) {
            $table->id();
            $table->string('name', 50)->comment('カテゴリ名'); // カテゴリ名（最大50文字）
            $table->integer('status')->comment('ステータス（1:公開、2:非公開）')->default(1); // ステータス（1:公開、2:非公開）
            $table->timestamps();
        });
    }

    /**
     * マイグレーションの取り消し（テーブル削除）
     */
    public function down(): void
    {
        Schema::dropIfExists('fair_categories');
        Schema::dropIfExists('notice_categories');
    }
};
