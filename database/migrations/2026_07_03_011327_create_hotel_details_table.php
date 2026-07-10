<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('hotel_details', function (Blueprint $table) {
            $table->id();
            $table->string('postal_code');      // 郵便番号
            $table->string('address');          // 住所
            $table->string('tel');              // 電話番号
            $table->string('email');            // メールアドレス
            $table->string('check_in_time');    // チェックイン可能時間 (例: 15:00〜24:00)
            $table->string('check_out_time');   // チェックアウト時間 (例: 11:00)
            $table->text('description');        // 施設詳細・コンセプト
            $table->text('amenities');          // アメニティの案内
            $table->text('access_info');        // 交通アクセス
            $table->text('child_policy');     // お子様・添い寝の規定
            $table->text('parking_info');     // 駐車場の案内（料金・台数）
            $table->text('cancel_policy');    // キャンセルポリシー（違約金）
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('hotel_details');
    }
};
