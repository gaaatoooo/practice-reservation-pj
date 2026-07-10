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
        Schema::table('users', function (Blueprint $table) {
            $table->string('tel')->nullable()->after('password')->comment('電話番号');
            $table->string('zip')->nullable()->after('tel')->comment('郵便番号');
            $table->string('address')->nullable()->after('zip')->comment('住所');
            $table->string('sex')->nullable()->after('address')->comment('性別');
            $table->date('birthday')->nullable()->after('sex')->comment('生年月日');
            $table->string('role')->default('user')->after('birthday')->comment('権限');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['tel', 'zip', 'address', 'sex', 'birthday', 'role']);
        });
    }
};
