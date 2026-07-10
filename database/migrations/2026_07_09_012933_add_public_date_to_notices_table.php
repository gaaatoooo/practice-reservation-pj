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
        Schema::table('notices', function (Blueprint $table) {
            $table->date('public_start_date')->nullable()->after('status')->comment('公開開始日');
            $table->date('public_end_date')->nullable()->after('public_start_date')->comment('公開終了日');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('notices', function (Blueprint $table) {
            $table->dropColumn(['public_start_date', 'public_end_date']);
        });
    }
};
