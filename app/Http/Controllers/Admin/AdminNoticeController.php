<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\NoticeCategory;
use App\Models\Notice;
use Illuminate\Http\Request;
use App\Http\Requests\Admin\StoreNoticeRequest;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class AdminNoticeController extends Controller
{
    const PAGINATION_COUNT = 10;

    /**
     * お知らせ一覧の表示
     */
    public function index(Request $request): Response
    {
        // 検索パラメータの取得
        $title = $request->query('title');
        $category = $request->query('category');
        $status = $request->query('status');

        // クエリビルダの初期化
        $query = Notice::query();

        $categories = NoticeCategory::select('id', 'name')->get();
        $statusList = config('constants.Notice.StatusName');

        // 1. カテゴリで検索 (完全一致)
        if (!empty($category)) {
            $query->where('category', $category);
        }

        // 2. ステータスで検索 (完全一致)
        if (!empty($status)) {
            $query->where('status', $status);
        }

        // 3. お知らせタイトルで検索 (あいまい検索)
        if (!empty($title)) {
            $pat = '%' . addcslashes($title, '%_\\') . '%';
            $query->where('title', 'like', '%' . $pat . '%');
        }

        // 最新順にすべてのお知らせを取得
        $notices = $query->latest()->paginate(self::PAGINATION_COUNT)->withQueryString();

        return Inertia::render('Admin/NoticeList', [
            'notices' => $notices,
            'filters' => $request->only(['category', 'title', 'status']), // フォームの初期値保持用
            'categories' => $categories,
            'statusList' => $statusList,
        ]);
    }

    /**
     * 新規お知らせ作成画面の表示
     */
    public function create(): Response
    {
        $categories = NoticeCategory::select('id', 'name')->get();
        $statusList = config('constants.Notice.StatusName');

        return Inertia::render('Admin/NoticeForm', [
            'categories' => $categories,
            'statusList' => $statusList,
        ]);
    }

    /**
     * 新規お知らせの保存処理
     */
    public function store(StoreNoticeRequest $request)
    {
        // フォームリクエストで検証済みのクリーンなデータを一括取得
        $validated = $request->validated();

        // データベースに登録
        Notice::create($validated);

        // 保存完了後、一覧画面へフラッシュリダイレクト
        return redirect()->route('admin.notices.index')->with('success', 'お知らせを登録しました。');
    }

    /**
     * お知らせ編集画面の表示
     */
    public function edit(Notice $notice): Response
    {
        $categories = NoticeCategory::select('id', 'name')->get();
        $statusList = config('constants.Notice.StatusName');

        return Inertia::render('Admin/NoticeEditForm', [
            'notice' => $notice,
            'categories' => $categories,
            'statusList' => $statusList,
        ]);
    }

    /**
     * お知らせの更新処理
     */
    public function update(StoreNoticeRequest $request, Notice $notice)
    {
        // 検証済みのクリーンなデータを一括取得
        $validated = $request->validated();

        $currentUpdatedAt = $request->input('updated_at');
        $currentCarbon = Carbon::parse($currentUpdatedAt)->setTimezone(config('app.timezone'));

        if ($currentUpdatedAt && !$notice->updated_at->eq($currentCarbon)) {
            return back()->with('error', 'お知らせ情報は他の操作によって更新されています。画面を再読み込みしてください。');
        }

        // データベース上の既存レコードを上書き更新
        $notice->update($validated);

        // 更新完了後、一覧画面へリダイレクト
        return redirect()->route('admin.notices.index')->with('success', 'お知らせを更新しました。');
    }

    /**
     * お知らせの削除
     */
    public function destroy(Request $request, Notice $notice)
    {
        $currentUpdatedAt = $request->input('updated_at');
        $currentCarbon = Carbon::parse($currentUpdatedAt)->setTimezone(config('app.timezone'));

        if ($currentUpdatedAt && !$notice->updated_at->eq($currentCarbon)) {
            return back()->with('error', 'お知らせ情報は他の操作によって更新されています。画面を再読み込みしてください。');
        }

        $notice->delete();
        return redirect()->back()->with('success', 'お知らせを削除しました。');
    }
}
