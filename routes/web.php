<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\AdminReservationController;
use App\Http\Controllers\Admin\AdminNoticeController;
use App\Http\Controllers\Admin\AdminFairController;
use App\Http\Controllers\Admin\AdminNoticeCategoryController;
use App\Http\Controllers\Admin\AdminFairCategoryController;
use App\Http\Controllers\Admin\AdminContactController;
use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AdminUserController;
use App\Http\Controllers\Admin\AdminRoomController;
use App\Http\Controllers\Admin\AdminReviewController;
use App\Http\Controllers\Admin\AdminPlanController;
use App\Http\Controllers\Admin\AdminMemberController;

use App\Http\Controllers\RoomAvailabilityController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\NoticeController;
use App\Http\Controllers\MypageController;
use App\Http\Controllers\FairController;
use App\Http\Controllers\HotelInfoController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\ChatBotController;

Route::inertia('/', 'welcome')->name('home');
Route::inertia('dashboard', 'dashboard')->name('dashboard');
// ユーザー用ダッシュボード
Route::inertia('user/dashboard', 'User/UserDashboard')->name('user.dashboard');

Route::middleware(['auth', 'verified'])->group(function () {
    // 1. 予約入力画面の表示
    // ⭕️ 修正：入力画面（/user/reservation）だけ、最初のアクセス（GET）と、確認画面からの戻り（POST）の両方を受け付けるようにします
    Route::match(['get', 'post'], '/user/reservation', [ReservationController::class, 'showForm'])->name('user.reservation');
    // 2. ⭕️ 追記：予約内容確認画面の表示（入力データを一時的に送るため、POSTで受け取ります）
    Route::post('/user/reservation/confirm', [ReservationController::class, 'showConfirm'])->name('user.reservation.confirm');
    // 3. 予約の確定・データベース保存処理
    Route::post('/user/reservation/store', [ReservationController::class, 'store'])->name('user.reservation.store');
    // 4. ⭕️ 追記：予約完了画面（サンクスページ）の表示
    Route::get('/user/reservation/thanks', [ReservationController::class, 'showThanks'])->name('user.reservation.thanks');

    // 2. ⭕️ 追記：リロードされた時（GET）に、エラーにせずダッシュボードへ強制送還するルート
    Route::get('/user/reservation/confirm', function () {
        return redirect()->route('user.dashboard'); // ダッシュボードの名前付きルート宛てにリダイレクト
    });
    Route::get('/user/reservation/store', function () {
        return redirect()->route('user.dashboard'); // ダッシュボードの名前付きルート宛てにリダイレクト
    });

    // マイページトップ（index）
    Route::get('/mypage', [MypageController::class, 'index'])->name('mypage.index');
    
    // すべての予約履歴一覧（list）
    Route::get('/mypage/reservations', [MypageController::class, 'list'])->name('mypage.reservations.index');
    Route::get('/mypage/reservations/{id}', [MypageController::class, 'show'])->name('mypage.reservations.show');
    Route::post('/mypage/reservations/{reservation}/cancel', [MypageController::class, 'cancel'])->name('mypage.reservations.cancel');
    Route::patch('/mypage/reservations/{id}/checkin', [MypageController::class, 'checkin'])->name('reservations.checkin');

    // 口コミ投稿画面
    Route::get('/user/review', [ReviewController::class, 'index'])->name('user.reviews.index');
    Route::get('/user/review/create', [ReviewController::class, 'create'])->name('review.create');
    Route::post('/user/review', [ReviewController::class, 'store'])->name('review.store');
});

// 管理者用ルートグループ
Route::middleware(['auth'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index'])->name('dashboard');
    // 予約管理一覧
    Route::get('/reservations', [AdminReservationController::class, 'index'])->name('reservations.index');
    Route::get('/reservations/create', [AdminReservationController::class, 'create'])->name('reservations.create');
    Route::post('/reservations', [AdminReservationController::class, 'store'])->name('reservations.store');
    // 予約詳細（必要に応じて）
    Route::get('/reservations/{reservation}', [AdminReservationController::class, 'show'])->name('reservations.show');
    Route::patch('/reservations/{reservation}', [AdminReservationController::class, 'update'])->name('reservations.update');
    Route::patch('/reservations/{reservation}/cancel', [AdminReservationController::class, 'cancel'])->name('reservations.cancel');
    Route::patch('/reservations/{reservation}/checkin', [AdminReservationController::class, 'checkin'])->name('reservations.checkin');

    // お知らせ管理（CRUD）
    Route::get('/notices', [AdminNoticeController::class, 'index'])->name('notices.index');
    Route::get('/notices/create', [AdminNoticeController::class, 'create'])->name('notices.create');
    Route::post('/notices', [AdminNoticeController::class, 'store'])->name('notices.store');
    Route::get('/notices/{notice}/edit', [AdminNoticeController::class, 'edit'])->name('notices.edit');
    Route::patch('/notices/{notice}', [AdminNoticeController::class, 'update'])->name('notices.update');
    Route::delete('/notices/{notice}', [AdminNoticeController::class, 'destroy'])->name('notices.destroy');

    // フェア管理（CRUD）
    Route::get('/fairs', [AdminFairController::class, 'index'])->name('fairs.index');
    Route::get('/fairs/create', [AdminFairController::class, 'create'])->name('fairs.create');
    Route::post('/fairs', [AdminFairController::class, 'store'])->name('fairs.store');
    Route::get('/fairs/{fair}/edit', [AdminFairController::class, 'edit'])->name('fairs.edit');
    Route::patch('/fairs/{fair}', [AdminFairController::class, 'update'])->name('fairs.update');
    Route::delete('/fairs/{fair}', [AdminFairController::class, 'destroy'])->name('fairs.destroy');

    // お知らせカテゴリ管理（CRUD）
    Route::get('/notice-categories', [AdminNoticeCategoryController::class, 'index'])->name('notice_categories.index');
    Route::post('/notice-categories', [AdminNoticeCategoryController::class, 'store'])->name('notice_categories.store');
    Route::patch('/notice-categories/{id}', [AdminNoticeCategoryController::class, 'update'])->name('notice_categories.update');
    Route::delete('/notice-categories/{id}', [AdminNoticeCategoryController::class, 'destroy'])->name('notice_categories.destroy');

    // フェアカテゴリ管理（CRUD）
    Route::get('/fair-categories', [AdminFairCategoryController::class, 'index'])->name('fair_categories.index');
    Route::post('/fair-categories', [AdminFairCategoryController::class, 'store'])->name('fair_categories.store');
    Route::patch('/fair-categories/{id}', [AdminFairCategoryController::class, 'update'])->name('fair_categories.update');
    Route::delete('/fair-categories/{id}', [AdminFairCategoryController::class, 'destroy'])->name('fair_categories.destroy');

    // お問い合わせ管理（一覧表示のみ）
    Route::get('/contacts', [AdminContactController::class, 'index'])->name('contacts.index');
    Route::post('/contacts/{contact}/reply', [AdminContactController::class, 'sendReply'])->name('contacts.reply');

    // 管理者管理（CRUD）
    Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
    Route::get('/users/create', [AdminUserController::class, 'create'])->name('users.create');
    Route::post('/users', [AdminUserController::class, 'store'])->name('users.store');
    Route::get('/users/{user}/edit', [AdminUserController::class, 'edit'])->name('users.edit');
    Route::patch('/users/{user}', [AdminUserController::class, 'update'])->name('users.update');
    Route::delete('/users/{user}', [AdminUserController::class, 'destroy'])->name('users.destroy');

    // 部屋管理（CRUD）
    Route::get('/rooms', [AdminRoomController::class, 'index'])->name('rooms.index');
    Route::get('/rooms/create', [AdminRoomController::class, 'create'])->name('rooms.create');
    Route::post('/rooms', [AdminRoomController::class, 'store'])->name('rooms.store');
    Route::get('/rooms/{room}/edit', [AdminRoomController::class, 'edit'])->name('rooms.edit');
    Route::patch('/rooms/{room}', [AdminRoomController::class, 'update'])->name('rooms.update');
    Route::delete('/rooms/{room}', [AdminRoomController::class, 'destroy'])->name('rooms.destroy');

    // 口コミ一覧
    Route::get('/reviews', [AdminReviewController::class, 'index'])->name('reviews.index');
    Route::patch('/reviews/{id}/reply', [AdminReviewController::class, 'reply'])->name('reviews.reply');

    // プラン管理（CRUD）
    Route::get('/plans', [AdminPlanController::class, 'index'])->name('plans.index');
    Route::get('/plans/create', [AdminPlanController::class, 'create'])->name('plans.create');
    Route::post('/plans', [AdminPlanController::class, 'store'])->name('plans.store');
    Route::get('/plans/{plan}/edit', [AdminPlanController::class, 'edit'])->name('plans.edit');
    Route::patch('/plans/{plan}', [AdminPlanController::class, 'update'])->name('plans.update');
    Route::delete('/plans/{plan}', [AdminPlanController::class, 'destroy'])->name('plans.destroy');
    
    // ユーザー管理（CRUD）
    Route::get('/members', [AdminMemberController::class, 'index'])->name('members.index');
    Route::get('/members/{member}/edit', [AdminMemberController::class, 'edit'])->name('members.edit');
    Route::patch('/members/{member}', [AdminMemberController::class, 'update'])->name('members.update');
    Route::delete('/members/{member}', [AdminMemberController::class, 'destroy'])->name('members.destroy');

});

// ユーザー用ルートグループ
// ⭕️ 追加：施設案内画面のUI表示ルート
Route::inertia('/user/hotel-info', 'User/HotelInfo')->name('user.hotel-info.index');
Route::get('/api/hotel-info', [HotelInfoController::class, 'getInfo'])->name('api.hotel-info');

// 空室状況取得API
Route::get('/api/room-availability', [RoomAvailabilityController::class, 'getAvailability']);
Route::get('/api/room-availability/rooms', [RoomAvailabilityController::class, 'getRoomsByDate']);

// お知らせ一覧ページ
Route::inertia('/user/notices', 'User/NoticeList')->name('user.notices.index');
// お知らせ一覧取得API
Route::get('/api/notices', [NoticeController::class, 'index'])->name('api.notices.index');
// お知らせ詳細取得
Route::get('/user/notice/{id}', [NoticeController::class, 'show'])->name('user.notice.show');

// フェア一覧ページ
Route::inertia('/user/fairs', 'User/FairList')->name('user.fairs.index');
// フェア情報取得API
Route::get('/api/fairs', [FairController::class, 'index'])->name('api.fairs.index');
// フェア詳細取得
Route::get('/user/fair/{id}', [FairController::class, 'show'])->name('user.fair.show');

// 部屋一覧ページと詳細ページのルート
Route::get('/user/rooms', [RoomController::class, 'index'])->name('rooms.index');
Route::get('/user/rooms/{room}', [RoomController::class, 'show'])->name('rooms.show');

Route::match(['get', 'post'],'/user/contact', [ContactController::class, 'showForm'])->name('contact.form');          // 入力
Route::post('/user/contact/confirm', [ContactController::class, 'showConfirm'])->name('contact.confirm'); // 確認
Route::post('/user/contact/store', [ContactController::class, 'store'])->name('contact.store');      // 確定
Route::get('/user/contact/thanks', [ContactController::class, 'showThanks'])->name('contact.thanks');  // 完了

// チャットボットAPI
Route::prefix('api')->group(function () {
    Route::post('/chatbot/ask', [ChatBotController::class, 'ask']);
});

require __DIR__.'/settings.php';
