<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\FairCategory;
use App\Models\Fair;
use App\Http\Requests\Admin\StoreFairRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class AdminFairController extends Controller
{
    const PAGINATION_COUNT = 10;

    /**
     * フェア一覧の表示
     */
    public function index(Request $request): Response
    {
        // 検索パラメータの取得
        $title = $request->query('title');
        $category = $request->query('category');
        $status = $request->query('status');

        // 最新順にすべてのフェアを取得
        $query = Fair::query();

        $categories = FairCategory::select('id', 'name')->get();
        $statusList = config('constants.Fair.StatusName');

        // 1. カテゴリで検索 (完全一致)
        if (!empty($category)) {
            $query->where('category', $category);
        }

        // 2. ステータスで検索 (完全一致)
        if (!empty($status)) {
            $query->where('status', $status);
        }

        // 3. フェアタイトルで検索 (あいまい検索)
        if (!empty($title)) {
            $pat = '%' . addcslashes($title, '%_\\') . '%';
            $query->where('title', 'like', '%' . $pat . '%');
        }

        // 最新順にすべてのお知らせを取得
        $fairs = $query->latest()->paginate(self::PAGINATION_COUNT)->withQueryString();

        return Inertia::render('Admin/FairList', [
            'fairs' => $fairs,
            'filters' => $request->only(['category', 'title', 'status']), // フォームの初期値保持用
            'categories' => $categories,
            'statusList' => $statusList,
        ]);
    }

    /**
     * 新規フェア作成画面の表示
     */
    public function create(): Response
    {
        $categories = FairCategory::select('id', 'name')->get();
        $statusList = config('constants.Notice.StatusName');

        return Inertia::render('Admin/FairForm', [
            'categories' => $categories,
            'statusList' => $statusList
        ]);
    }

    /**
     * 新規フェアの保存処理
     */
    public function store(StoreFairRequest $request)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            
            // ファイル名を取得
            $filename = $file->getClientOriginalName();
            
            // storage/app/public/img/ の中へ安全に保存
            Storage::disk('public')->putFileAs('img', $file, $filename);
            
            // データベースには 'storage/img/〜' の形でパスを保存（artisan storage:link前提）
            $data['image_url'] = '/img/' . $filename;
        }

        Fair::create($data);
        return redirect()->route('admin.fairs.index');
    }

    /**
     * フェア編集画面の表示
     */
    public function edit(Fair $fair): Response
    {
        $categories = FairCategory::select('id', 'name')->get();
        $statusList = config('constants.Notice.StatusName');
        
        return Inertia::render('Admin/FairEditForm', [
            'fair' => $fair,
            'categories' => $categories,
            'statusList' => $statusList
        ]);
    }

    /**
     * フェアの更新処理
     */
    public function update(StoreFairRequest $request, Fair $fair)
    {
        $data = $request->validated();

        if ($request->hasFile('image')) {
            // 古い画像があれば Storage 経由で安全に削除
            // データベースに 'storage/img/filename' で入っているため、'img/filename' の形に変換して指定
            if (!empty($fair->image_url)) {
                $oldPath = str_replace('storage/', '', $fair->image_url);
                if (Storage::disk('public')->exists($oldPath)) {
                    Storage::disk('public')->delete($oldPath);
                }
            }

            $file = $request->file('image');
            $filename = $file->getClientOriginalName();
            
            // 新しい画像を保存
            Storage::disk('public')->putFileAs('img', $file, $filename);
            $data['image_url'] = '/img/' . $filename;
        }

        $fair->update($data);
        return redirect()->route('admin.fairs.index');
    }

    public function destroy(Fair $fair)
    {
        $fair->delete();
        return redirect()->back();
    }
}
