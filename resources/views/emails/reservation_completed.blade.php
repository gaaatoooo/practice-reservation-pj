<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <title>予約完了のお知らせ</title>
</head>
<body style="font-family: sans-serif; color: #333; line-height: 1.6; padding: 20px;">

    <p>{{ $reservation->guest_name ?? auth()->user()->name }} 様</p>

    <p>この度は、当ホテルをご予約いただき誠にありがとうございます。<br>
    以下の内容にて、ご予約を承りましたのでご確認ください。</p>

    <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0; border: 1px solid #eee;">
        <h3 style="margin-top: 0; color: #2563eb;">🏨 ご予約内容明細</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            <tr>
                <td style="padding: 6px 0; color: #666; width: 120px;">お部屋タイプ</td>
                <td style="padding: 6px 0; font-weight: bold;">{{ $reservation->room->name }}</td>
            </tr>
            <tr>
                <td style="padding: 6px 0; color: #666;">選択プラン</td>
                <td style="padding: 6px 0; font-weight: bold;">{{ $reservation->plan->name }}</td>
            </tr>
            <tr>
                <td style="padding: 6px 0; color: #666;">チェックイン</td>
                <td style="padding: 6px 0; font-weight: bold;">{{ $reservation->reservation_start_date }}</td>
            </tr>
            <tr>
                <td style="padding: 6px 0; color: #666;">チェックアウト</td>
                <td style="padding: 6px 0; font-weight: bold;">{{ $reservation->reservation_end_date }}</td>
            </tr>
            <tr>
                <td style="padding: 6px 0; color: #666;">宿泊人数</td>
                <td style="padding: 6px 0; font-weight: bold;">{{ $reservation->number }} 名様</td>
            </tr>
            <tr style="border-top: 1px dashed #ddd;">
                <td style="padding: 12px 0 0 0; color: #666; font-size: 16px; font-weight: bold;">総合計金額</td>
                <td style="padding: 12px 0 0 0; color: #2563eb; font-size: 20px; font-weight: bold;">
                    ¥{{ number_format($reservation->total_price) }}（税込）
                </td>
            </tr>
        </table>
    </div>

    <p>当日のご来館を、スタッフ一同心よりお待ち申し上げております。<br>
    何かご不明な点や変更がございましたら、本メールへの返信、またはお電話にてお問い合わせください。</p>

    <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
    <p style="font-size: 12px; color: #999;">
        ※本メールはシステムによる自動送信です。<br>
        宿泊予約システムホテル / 住所: 東京都千代田区... / TEL: 03-0000-0000
    </p>

</body>
</html>
