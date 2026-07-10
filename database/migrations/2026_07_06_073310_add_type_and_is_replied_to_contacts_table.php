<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('contacts', function (Blueprint $table) {
            // 💡 1: ユーザーから, 2: 管理者から（デフォルトは1）
            $table->integer('type')->default(1)->after('id')->comment('登録種別');
            // 💡 0: 未返信, 1: 返信済み（デフォルトは0）
            $table->integer('is_replied')->default(0)->after('content')->comment('返信フラグ');
        });
    }

    public function down(): void
    {
        Schema::table('contacts', function (Blueprint $table) {
            $table->dropColumn(['type', 'is_replied']);
        });
    }
};
