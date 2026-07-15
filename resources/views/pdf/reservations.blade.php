<!DOCTYPE html>
<html lang="ja">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>予約管理一覧</title>
    <style>
        /* ⭕️ @font-face の中だけで src を指定する */
        @font-face {
            font-family: 'ipaexg';
            font-style: normal;
            font-weight: normal;
            src: url('../storage/fonts/ipaexg.ttf') format('truetype');
        }
        @font-face {
            font-family: 'ipaexg';
            font-style: normal;
            font-weight: bold;
            src: url('../storage/fonts/ipaexg.ttf') format('truetype'); /* 同じファイルでOK */
        }
        
        /* ⭕️ 全ての要素にフォントを適用（src は記述しない） */
        * {
            font-family: 'ipaexg', sans-serif !important;
        }

        body {
            font-size: 11px;
            color: #334155;
            line-height: 1.5;
        }

        .header {
            text-align: center;
            margin-bottom: 20px;
        }
        h1 {
            font-size: 18px;
            margin-bottom: 5px;
            color: #0f172a;
        }
        .date {
            text-align: right;
            font-size: 10px;
            color: #64748b;
        }
        /* ⭕️ テーブルはみ出し防止用のCSS修正 */
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            /* 1. 各列の横幅パーセンテージを厳密に固定する設定 */
            table-layout: fixed; 
        }
        th, td {
            border: 1px solid #cbd5e1;
            padding: 6px 6px;
            text-align: left;
            font-size: 10px; /* 文字サイズを少し小さくして収まりを良くします */
            
            /* 2. セル内で文字が長くなった場合に自動折り返し（改行）させる設定 */
            word-wrap: break-word;
            word-break: break-all;
            overflow: hidden;
        }
        th {
            background-color: #f1f5f9;
            color: #475569;
            font-weight: bold;
        }
        .text-right {
            text-align: right;
        }
        .status-badge {
            font-size: 9px;
            padding: 2px 4px;
            border-radius: 3px;
        }
    </style>
</head>
<body>

    <div class="date">出力日時: {{ now()->format('Y-m-d H:i') }}</div>
    
    <div class="header">
        <h1>予約管理一覧</h1>
        <p>該当件数: {{ count($reservations) }} 件</p>
    </div>

    <table>
        <thead>
            <tr>
                <th style="width: 5%;">ID</th>
                <th style="width: 10%;">宿泊者名</th>
                <th style="width: 18%;">部屋名</th>
                <th style="width: 25%;">プラン名</th>
                <th style="width: 12%;">チェックイン</th>
                <th style="width: 12%;">チェックアウト</th>
                <th style="width: 12%;">合計金額</th>
            </tr>
        </thead>
        <tbody>
            @foreach($reservations as $res)
                <tr>
                    <td>{{ $res->id }}</td>
                    <td>{{ $res->user?->name ?? '不明' }}</td>
                    <td>{{ $res->room?->name ?? '不明' }}</td>
                    <td>{{ $res->plan?->name ?? 'なし' }}</td>
                    <td>{{ $res->reservation_start_date }}</td>
                    <td>{{ $res->reservation_end_date }}</td>
                    <td class="text-right">¥{{ number_format($res->total_price) }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>

</body>
</html>
