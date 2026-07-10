<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Reservation;
use App\Services\ReservationService;

class MypageController extends Controller
{
    protected $reservationService;
    protected $topCount = 3;

    // サービスをコンストラクタでインジェクション
    public function __construct(ReservationService $reservationService)
    {
        $this->reservationService = $reservationService;
    }

    /**
     * 1. マイページトップ画面（直近3件のみ表示）
     */
    public function index(Request $request): Response
    {
        $user = $request->user();

        // 直近の予約データを最大3件だけ取得（最新順）
        $recentReservations = Reservation::where('user_id', $user->id)
            ->where('status', config('constants.Reservation.Status.Reserved')) // 1: 予約済みのステータスのみ
            ->with(['room', 'plan'])
            ->orderBy('reservation_start_date', 'desc')
            ->take($this->topCount)
            ->get();

        return Inertia::render('Mypage/MypageTop', [
            'reservations' => $recentReservations,
            'auth_user' => [
                'id' => $user->id,
                'name' => $user->name,
                'tel' => $user->tel,
            ]
        ]);
    }

    /**
     * 2. すべての予約履歴一覧画面
     */
    public function list(Request $request): Response
    {
        $user = $request->user();

        // こちらは制限なしで全件取得
        $allReservations = Reservation::where('user_id', $user->id)
            ->with(['room', 'plan'])
            ->orderBy('reservation_start_date', 'desc')
            ->get();

        return Inertia::render('Mypage/ReservationList', [
            'reservations' => $allReservations,
            'auth_user' => [
                'id' => $user->id,
                'name' => $user->name,
                'tel' => $user->tel,
            ]
        ]);
    }

    /**
     * 3. 選択した予約詳細画面
     */
    public function show(Request $request, int $id)
    {
        // 該当する予約を取得（存在しない場合は404エラー）
        $reservation = Reservation::where('id', $id)->with(['room', 'plan', 'user'])->findOrFail($id);

        // 1. 安全ガード：ログインユーザー本人の予約であるかチェック
        if ($reservation->user_id !== $request->user()->id) {
            abort(403);
        }

        return Inertia::render('Mypage/ReservationDetail', [
            'reservation' => $reservation
        ]);
    }

    /**
     * ⭕️ 宿泊客自身による手動チェックイン
     */
    public function checkin(int $id)
    {
        // 他人の予約を勝手に操作できないよう厳密にチェック
        $reservation = Reservation::where('user_id', Auth::id())->findOrFail($id);

        // すでにキャンセルされている場合はチェックイン不可
        if ($reservation->status !== 2) {
            $reservation->update(['status' => 3]); // 3: チェックイン済み
        }

        return redirect()->back()->with('success', 'チェックインが完了しました。ごゆっくりお過ごしください。');
    }

    /**
     * 予約キャンセルリクエストの受け取り
     */
    public function cancel(Request $request, Reservation $reservation)
    {
        // 1. 安全ガード：ログインユーザー本人の予約であるかチェック
        if ($reservation->user_id !== $request->user()->id) {
            abort(403);
        }

        // 2. 安全ガード：すでにキャンセル済み、またはチェックイン日（今日以降）を過ぎている場合は拒否
        if ($reservation->status === config('constants.Reservation.Status.Canceled') ||
            $reservation->reservation_start_date < now()->toDateString()) {
            return redirect()->back()->with('error', 'この予約はキャンセルできません。');
        }

        // 3. サービスへキャンセル処理を委譲
        $this->reservationService->cancelReservation($reservation);

        // 4. 自画面へリダイレクト（Inertiaが最新の予約一覧データを自動で再取得・フロントへ反映）
        return redirect()->back()->with('success', '予約をキャンセルしました。|' . microtime(true));
    }
}
