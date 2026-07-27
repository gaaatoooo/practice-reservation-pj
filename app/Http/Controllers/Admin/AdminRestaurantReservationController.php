<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\RestaurantReservation;
use App\Models\RestaurantStock;
use Illuminate\Http\Request;
use App\Http\Requests\Admin\StoreRestaurantStockRequest;
use App\Http\Requests\Admin\UpdateRestaurantStockRequest;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class AdminRestaurantReservationController extends Controller
{
    const PAGINATION_COUNT = 10;

    public function index(Request $request)
    {
        // 検索パラメータの取得
        $dateFrom = $request->query('date_from');
        $dateTo = $request->query('date_to');

        // クエリビルダの初期化
        $query = RestaurantStock::query();

        // 5. 宿泊日（範囲指定）
        // チェックイン日が指定期間内、または滞在期間が重なるデータを抽出
        if (!empty($dateFrom)) {
            $query->where('date', '>=', $dateFrom);
        }
        if (!empty($dateTo)) {
            $query->where('date', '<=', $dateTo);
        }

        // 検索条件を維持したまま、最新順に取得
        $stocks = $query->latest()->paginate(self::PAGINATION_COUNT)->withQueryString();

        return Inertia::render('Admin/RestaurantReservationList', [
            'stocks' => $stocks,
            'filters' => $request->only(['date_from', 'date_to']) // フォームの初期値保持用
        ]);
    }

    /**
     * 新規予約作成画面の表示
     */
    public function create()
    {
        return Inertia::render('Admin/RestaurantReservationForm', [
            'times' => config('constants.Restaurant.Times'),
        ]);
    }

    /**
     * 新規予約枠データのバリデーションと保存
     */
    public function store(StoreRestaurantStockRequest $request)
    {
        $validated = $request->validated();

        // ⭕️ 選択された時間の数だけループし、1レコードずつ作成する
        foreach ($validated['times'] as $time) {
            RestaurantStock::create([
                'date'   => $validated['date'],
                'time'   => $time,
                'capacity' => $validated['capacity'],
            ]);
        }

        // ⭕️ 登録完了後は、Eagerロードバグ対応済みの予約一覧画面へリダイレクト
        return redirect()->route('admin.restaurant_reservations.index')
            ->with('success', '予約枠を新規に登録しました。');
    }

    public function edit(RestaurantStock $stock): Response
    {
        $reservations = RestaurantReservation::where('restaurant_stock_id', $stock->id)
            ->with('user')
            ->get();

        return Inertia::render('Admin/RestaurantReservationEditForm', [
            'stock' => $stock,
            'reservations' => $reservations,
            'times' => config('constants.Restaurant.Times'),
        ]);
    }

    /**
     * 予約枠データの更新
     */
    public function update(UpdateRestaurantStockRequest $request, RestaurantStock $stock)
    {
        $validated = $request->validated();

        $currentUpdatedAt = $request->input('updated_at');
        $currentCarbon = Carbon::parse($currentUpdatedAt)->setTimezone(config('app.timezone'));

        if ($currentUpdatedAt && !$stock->updated_at->eq($currentCarbon)) {
            return back()->with('error', 'この予約枠は他の操作によって更新されています。画面を再読み込みしてください。');
        }

        $stock->update($validated);

        return redirect()->route('admin.restaurant_reservations.edit', $stock)
            ->with('success', '予約枠を更新しました。');
    }

    /**
     * 予約枠の削除
     * 既に予約が存在する場合は削除不可とする
     */
    public function destroy(Request $request, RestaurantStock $stock)
    {
        $hasReservations = RestaurantReservation::where('restaurant_stock_id', $stock->id)->exists();

        if ($hasReservations) {
            return back()->with('error', 'この予約枠には既に予約が入っているため削除できません。');
        }

        $currentUpdatedAt = $request->input('updated_at');
        $currentCarbon = Carbon::parse($currentUpdatedAt)->setTimezone(config('app.timezone'));

        if ($currentUpdatedAt && !$stock->updated_at->eq($currentCarbon)) {
            return back()->with('error', 'この予約枠は他の操作によって更新されています。画面を再読み込みしてください。');
        }

        $stock->delete();

        return redirect()->route('admin.restaurant_reservations.index')
            ->with('success', '予約枠を削除しました。');
    }

}
