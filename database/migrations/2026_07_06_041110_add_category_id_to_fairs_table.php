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
        Schema::table('fairs', function (Blueprint $table) {
            $table->integer('category')->nullable()->after('title')->comment('カテゴリID');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('fairs', function (Blueprint $table) {
            $table->dropColumn('category');
        });
    }
};
