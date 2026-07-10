<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>ご予約キャンセル完了のお知らせ</title>
    <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #333333; line-height: 1.6; }
        .container { max-w: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; rounded: 8px; }
        .header { border-bottom: 2px solid #ef4444; padding-bottom: 10px; margin-bottom: 20px; }
        .header h1 { font-size: 20px; color: #ef4444; margin: 0; }
        .detail-box { bg-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0; border: 1px solid #f3f4f6; }
        .detail-item { margin-bottom: 8px; font-size: 14px; }
        .label { color: #6b7280; width: 120px; display: inline-block; }
        .footer { font-size: 12px; color: #9ca3af; margin-top: 30px; border-top: 1px solid #e5e7eb; padding-top: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>ご予約キャンセル手続き完了</h1>
        </div>

        <p>{{ $reservation->guest_name ?? auth()->user()->name }} 様</p>
        
        <p>当ホテルをご検討いただき、誠にありがとうございました。<br>
        宿泊予約のキャンセル手続きが、正常に完了いたしましたので通知いたします。</p>

        <div class="detail-box">
            <div class="detail-item"><span class="label">予約番号：</span><strong>#{{ $reservation->id }}</strong></div>
            <div class="detail-item"><span class="label">お部屋タイプ：</span>{{ $reservation->room->name }}</div>
            <div class="detail-item"><span class="label">ご利用プラン：</span>{{ $reservation->plan->name }}</div>
            <div class="detail-item"><span class="label">チェックイン：</span>{{ $reservation->reservation_start_date }}</div>
            <div class="detail-item"><span class="label">チェックアウト：</span>{{ $reservation->reservation_end_date }}</div>
            <div class="detail-item"><span class="label">ご利用人数：</span>{{ $reservation->number }} 名様</div>
            <div class="detail-item"><span class="label">合計料金：</span>¥{{ number_format($reservation->total_price) }}（税込）</div>
        </div>

        <p>※本内容にお心当たりがない場合、またはご不明な点がございましたら、大変お手数ですがホテル受付まで直接お電話にてお問い合わせください。</p>

        <div class="footer">
            <p>ーーーーーーーーーーーーーーーーーーーー<br>
            宿泊予約システム ホテル フロント<br>
            〒003-0000 北海道札幌市<br>
            TEL: 011-000-0000 / EMAIL: info@example.com<br>
            ーーーーーーーーーーーーーーーーーーーー</p>
        </div>
    </div>
</body>
</html>
