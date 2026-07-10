<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. 既存の文字列型デフォルト制約を一度完全にドロップ（エラーの根本原因を排除）
        DB::statement('ALTER TABLE users ALTER COLUMN role DROP DEFAULT');

        // 2. 安全に文字列から数値（integer）へキャスト変換を実行
        DB::statement('ALTER TABLE users ALTER COLUMN role TYPE integer USING role::integer');

        // 3. 新しい数値型のデフォルト値「1」を設定
        Schema::table('users', function (Blueprint $table) {
            $table->integer('role')->default(1)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // ロールバック処理：デフォルト値を削除し、元の文字列型（varchar）に戻す
        DB::statement('ALTER TABLE users ALTER COLUMN role DROP DEFAULT');
        DB::statement('ALTER TABLE users ALTER COLUMN role TYPE varchar USING role::varchar');

        Schema::table('users', function (Blueprint $table) {
            $table->string('role')->default(null)->nullable()->change();
        });
    }
};
