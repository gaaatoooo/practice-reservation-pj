<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Contact;
use App\Models\Reservation;
use App\Models\Notice;
use App\Models\Fair;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class AdminDashboardController extends Controller
{
    public function index(): Response
    {
        // 💡 1. まだ返信していないお問合せ（type=1 かつ is_replied=0）を最新順に上位5件取得
        $unrepliedContacts = Contact::where('type', 1)
            ->where('is_replied', 0)
            ->latest()
            ->take(5)
            ->get();

        // 💡 2. チェックイン日がシステム日付（今日）の予約データを昇順で上位15件取得
        // ユーザー名と部屋名を表示するため eagerロード (with) を行います
        $today = Carbon::today()->toDateString();
        $todayReservations = Reservation::with(['user', 'room'])
            ->whereDate('reservation_start_date', $today)
            ->orderBy('reservation_start_date', 'asc')
            ->take(15)
            ->get();
        
        // 公開中のお知らせ
        $notices = Notice::where('status', config('constants.Notice.Status.Published'))
                 ->take(5)
                 ->get();

        $fairs = Fair::where('status', config('constants.Fair.Status.Published'))
                 ->take(5)
                 ->get();

        return Inertia::render('Admin/AdminDashboard', [
            'unrepliedContacts' => $unrepliedContacts,
            'todayReservations' => $todayReservations,
            'notices'           => $notices,
            'fairs'              => $fairs
        ]);
    }
}
