<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\DB;
use App\Models\Reservation;
use App\Models\User;
use App\Models\Room;
use App\Models\Plan;
use Illuminate\Http\Request;
use App\Http\Requests\Admin\StoreReservationRequest;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class AdminReservationController extends Controller
{
    const PAGINATION_COUNT = 10;

    public function index(Request $request)
    {
        // 検索パラメータの取得
        $searchId = $request->query('reservation_id');
        $searchName = $request->query('user_name');
        $searchTel = $request->query('user_tel');
        $searchStatus = $request->query('status');
        $dateFrom = $request->query('date_from');
        $dateTo = $request->query('date_to');

        // クエリビルダの初期化
        $query = Reservation::query();

        // 1. 予約IDで検索 (完全一致)
        if (!empty($searchId)) {
            $query->where('id', $searchId);
        }

        // 2. ステータスで検索 (完全一致)
        if (!empty($searchStatus)) {
            $query->where('status', $searchStatus);
        }

        // 3. 宿泊客名で検索 (usersテーブルと結合してあいまい検索)
        if (!empty($searchName)) {
            $pat = '%' . addcslashes($searchName, '%_\\') . '%';
            $query->whereHas('user', function ($q) use ($pat) {
                $q->where('name', 'like', '%' . $pat . '%');
            });
        }

        // 4. 電話番号で検索 (usersテーブルの増設カラムをあいまい検索)
        if (!empty($searchTel)) {
            $query->whereHas('user', function ($q) use ($searchTel) {
                $q->where('tel', 'like', '%' . $searchTel . '%');
            });
        }

        // 5. 宿泊日（範囲指定）
        // チェックイン日が指定期間内、または滞在期間が重なるデータを抽出
        if (!empty($dateFrom)) {
            $query->where('checkin_date', '>=', $dateFrom);
        }
        if (!empty($dateTo)) {
            $query->where('checkout_date', '<=', $dateTo);
        }

        // 3. 【要件】エクスポート判定
        if ($request->input('export') === 'csv') {
            if (!$query->exists()) {
                return redirect()->back()->with('error', '出力対象のデータが存在しません。');
            }
            return $this->exportCsv($query);
        }

        if ($request->input('export') === 'pdf') {
            if (!$query->exists()) {
                // 別タブで開くため、JavaScriptのウィンドウを閉じるかエラー画面を出す
                abort(404, '出力対象のデータが存在しません。');
            }
            return $this->exportPdf($query);
        }

        // 検索条件を維持したまま、最新順に取得
        $reservations = $query->with(['user', 'room'])->latest()->paginate(self::PAGINATION_COUNT)->withQueryString();

        return Inertia::render('Admin/ReservationList', [
            'reservations' => $reservations,
            'filters' => $request->only(['reservation_id', 'user_name', 'user_tel', 'status', 'date_from', 'date_to']) // フォームの初期値保持用
        ]);
    }

    /**
     * 新規予約作成画面の表示
     */
    public function create()
    {
        // ⭕️ フロントエンドのプルダウン用に、必要なカラムだけを軽量に取得
        // role カラムが一般ユーザー（1）のみに絞り込むなど、環境に合わせて調整してください
        $users = User::select('id', 'name', 'email')
            ->orderBy('name', 'asc')
            ->get();

        $rooms = Room::select('id', 'name', 'price')
            ->orderBy('id', 'asc')
            ->get();

        $plans = Plan::select('id', 'name', 'price')
            ->orderBy('id', 'asc')
            ->get();

        return Inertia::render('Admin/ReservationForm', [
            'users' => $users,
            'rooms' => $rooms,
            'plans' => $plans
        ]);
    }

    /**
     * 新規予約データのバリデーションと保存
     */
    public function store(StoreReservationRequest $request)
    {
        $validated = $request->validated();

        // フォームリクエストを通過した、検証済みデータのみを取得して保存
        Reservation::create($validated);

        // ⭕️ 登録完了後は、Eagerロードバグ対応済みの予約一覧画面へリダイレクト
        return redirect()->route('admin.reservations.index')
            ->with('success', '予約情報を新規に登録しました。');
    }

    public function show(Reservation $reservation): Response
    {
        // リレーション（ユーザー、客室）をロード
        $reservation->load(['user', 'room', 'plan']);

        $rooms = Room::select('id', 'name', 'price')
        ->orderBy('id', 'asc')
        ->get();

        $plans = Plan::select('id', 'name', 'price')
        ->orderBy('id', 'asc')
        ->get();

        return Inertia::render('Admin/ReservationDetail', [
            'reservation' => $reservation,
            'rooms'       => $rooms,
            'plans'       => $plans,
        ]);
    }

    /**
     * ⭕️ 予約情報の一括更新（詳細画面からの送信先）
     */
    public function update(Request $request, Reservation $reservation)
    {
        // 1. 編集可能な全項目に対して厳密にバリデーションを実施
        $validated = $request->validate([
            'reservation_start_date' => ['required', 'date'],
            // チェックアウト日はチェックイン日より後の日付であることを保証
            'reservation_end_date'   => ['required', 'date', 'after:reservation_start_date'],
            'total_price'            => ['required', 'integer', 'min:0'],
            'admin_memo'             => ['nullable', 'string', 'max:5000'],
            'number'                 => ['required', 'integer', 'min:1'],
            'room_id'                => ['required', 'integer', 'exists:rooms,id'],
            'plan_id'                => ['required', 'integer', 'exists:plans,id'],
        ], [
            'reservation_start_date.required' => 'チェックイン日を入力してください。',
            'reservation_end_date.required'   => 'チェックアウト日を入力してください。',
            'reservation_end_date.after'      => 'チェックアウト日はチェックイン日より後の日付にしてください。',
            'total_price.required'            => '合計金額を入力してください。',
            'total_price.integer'             => '合計金額は数値で入力してください。',
            'number.required'                 => '人数を入力してください。',
            'number.integer'                  => '人数は数値で入力してください。',
            'room_id.required'                => '部屋を選択してください。',
            'plan_id.required'                => 'プランを選択してください。'
        ]);

        // ⭕️ フロントから送られてきたupdated_atと、DB上の現在のupdated_atを比較
        $currentUpdatedAt = $request->input('updated_at');
        $currentCarbon = Carbon::parse($currentUpdatedAt)->setTimezone(config('app.timezone'));

        if ($currentUpdatedAt && !$reservation->updated_at->eq($currentCarbon)) {
            return back()->with('error', 'この予約は他の操作によって更新されています。画面を再読み込みしてください。');
        }

        // 3. データベースを一括更新
        $reservation->update($validated);

        // 4. preserveScroll 連携を最大化するため、元の画面へバックリダイレクト
        return redirect()->back()
            ->with('success', '予約変更内容を保存しました。');
    }

    /**
     * 管理者による代理キャンセル処理
     */
    public function cancel(Request $request, Reservation $reservation)
    {
        // すでにキャンセル済みの場合は早期リターン
        if ($reservation->status === 2) {
            return redirect()->back()->with('error', 'この予約はキャンセル済みです。画面を再読み込みしてください。');
        }

        $currentUpdatedAt = $request->input('updated_at');
        $currentCarbon = Carbon::parse($currentUpdatedAt)->setTimezone(config('app.timezone'));

        if ($currentUpdatedAt && !$reservation->updated_at->eq($currentCarbon)) {
            return back()->with('error', 'この予約は他の操作によって更新されています。画面を再読み込みしてください。');
        }

        // トランザクションを張り、ステータス更新と空室履歴の自動削除を安全に実行
        DB::transaction(function () use ($reservation) {
            // 1. ステータスを 2:キャンセル済 に更新
            $reservation->update(['status' => 2, 'cancel_date' => Carbon::now()]);

            // 2. 期間中の該当部屋の空室履歴（room_availabilities）を自動削除して在庫を即時返却
            DB::table('room_availabilities')
                ->where('room_id', $reservation->room_id)
                ->where('date', '>=', $reservation->reservation_start_date)
                ->where('date', '<', $reservation->reservation_end_date)
                ->delete();
        });

        // ユーザー側へのHTMLメール送信処理(try-catch)等が必要であれば、ここに既存のMailableロジックを挟むことも可能です

        return redirect()->back()->with('success', "予約 #{$reservation->id} をキャンセルしました。");;
    }

    /**
     * ⭕️ 予約のチェックイン処理
     */
    public function checkin(Request $request, Reservation $reservation)
    {
        // すでにキャンセル済みの場合は早期リターン
        if ($reservation->status === 3) {
            return redirect()->back()->with('error', 'この予約はチェックイン済みです。画面を再読み込みしてください。');
        }

        $currentUpdatedAt = $request->input('updated_at');
        $currentCarbon = Carbon::parse($currentUpdatedAt)->setTimezone(config('app.timezone'));

        if ($currentUpdatedAt && !$reservation->updated_at->eq($currentCarbon)) {
            return back()->with('error', 'この予約は他の操作によって更新されています。画面を再読み込みしてください。');
        }

        // 予約がキャンセルされていない場合のみステータスを 3（チェックイン済み）に変更
        if ($reservation->status !== 2) {
            $reservation->update([
                'status' => 3
            ]);
        }

        return redirect()->back()
            ->with('success', "予約 #{$reservation->id} のチェックイン処理が完了しました。");
    }

    /**
     * CSVエクスポート処理
     */
    private function exportCsv($query)
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="reservations_' . date('YmdHis') . '.csv"',
            'Pragma' => 'no-cache', 'Cache-Control' => 'must-revalidate', 'Expires' => '0',
        ];

        return response()->stream(function () use ($query) {
            $handle = fopen('php://output', 'w');
            fwrite($handle, "\xEF\xBB\xBF"); // Excel文字化け防止BOM
            
            fputcsv($handle, ['予約ID', '宿泊者名', '部屋名', 'プラン名', 'チェックイン', 'チェックアウト', '合計金額', 'ステータス']);

            $query->latest('id')->chunk(500, function ($reservations) use ($handle) {
                foreach ($reservations as $res) {
                    fputcsv($handle, [
                        $res->id,
                        $res->user?->name ?? '不明',
                        $res->room?->name ?? '不明',
                        $res->plan?->name ?? 'なし',
                        $res->reservation_start_date,
                        $res->reservation_end_date,
                        $res->total_price,
                        $res->status == 1 ? '確定' : 'キャンセル済',
                    ]);
                }
            });
            fclose($handle);
        }, 200, $headers);
    }

    /**
     * ⭕️ PDFエクスポート処理（一覧に表示されている内容を出力）
     */
    private function exportPdf($query)
    {
        $reservations = $query->with(['room','plan','user'])->latest('id')->get();

        // ⭕️ ファサードを使わず、サービスコンテナからラッパーを直接生成する
        $pdf = app()->make('dompdf.wrapper');
        
        // ビューとデータをロード
        $pdf->loadView('pdf.reservations', compact('reservations'))->setOption(['defaultFont' => 'ipaexg', 'isHtml5ParserEnabled' => true]);

        // A4縦サイズに指定
        $pdf->setPaper('A4', 'portrait');

        // ブラウザ上でプレビュー表示
        return $pdf->stream('reservation_list_' . date('YmdHis') . '.pdf');
    }
}
