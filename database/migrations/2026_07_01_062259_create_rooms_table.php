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
        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->string('name')->comment('部屋名');
            $table->integer('price')->comment('料金');
            $table->integer('capacity')->comment('定員');
            $table->text('description')->nullable()->comment('紹介文');
            $table->string('url')->nullable()->comment('URL');
            $table->string('img_path')->nullable()->comment('画像保存パス');
            $table->string('img_name')->nullable()->comment('画像ファイル名');
            $table->boolean('status')->default(true)->comment('公開ステータス');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rooms');
    }
};
