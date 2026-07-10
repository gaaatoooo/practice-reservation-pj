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
        // 1. 古いboolean型のデフォルト値定義を一度削除
        DB::statement('ALTER TABLE fairs ALTER COLUMN status DROP DEFAULT');

        // 2. 既存のデータを変換しながら、型をintegerに変更
        DB::statement('ALTER TABLE fairs ALTER COLUMN status TYPE integer USING (CASE WHEN status IS TRUE THEN 1 ELSE 3 END)');

        // 3. 新しいデフォルト値（1）を設定
        DB::statement('ALTER TABLE fairs ALTER COLUMN status SET DEFAULT 1');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // 1. integer型のデフォルト値定義を削除
        DB::statement('ALTER TABLE fairs ALTER COLUMN status DROP DEFAULT');

        // 2. データを復元しながら、型をbooleanに変更
        DB::statement('ALTER TABLE fairs ALTER COLUMN status TYPE boolean USING (CASE WHEN status = 1 THEN TRUE ELSE FALSE END)');

        // 3. 古いデフォルト値（false）を設定
        DB::statement('ALTER TABLE fairs ALTER COLUMN status SET DEFAULT FALSE');
    }
};
