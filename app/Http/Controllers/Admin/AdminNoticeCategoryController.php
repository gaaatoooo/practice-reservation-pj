<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CategoryRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminNoticeCategoryController extends Controller
{
    /**
     * お知らせカテゴリ一覧の表示
     */
    public function index(): Response
    {
        $categories = DB::table('notice_categories')->orderBy('id', 'asc')->get();

        return Inertia::render('Admin/NoticeCategoryList', [
            'categories' => $categories,
        ]);
    }

    /**
     * 新規追加
     */
    public function store(CategoryRequest $request)
    {
        DB::table('notice_categories')->insert([
            'name' => $request->validated()['name'],
            'created_at' => now(),
            'updated_at' => now()
        ]);

        return redirect()->route('admin.notice_categories.index')->with('success', '新しいカテゴリを登録しました。');
    }

    /**
     * インライン更新
     */
    public function update(CategoryRequest $request, int $id)
    {
        $category = DB::table('notice_categories')->where('id', $id)->first();

        if (! $category) {
            abort(404, '対象のカテゴリが見つかりません。');
        }

        // ⭕️ フロントから送られてきたupdated_atと、DB上の現在のupdated_atを比較
        $currentUpdatedAt = $request->input('updated_at');

        if ($currentUpdatedAt !== $category->updated_at) {
            return back()->with('error', 'このカテゴリは他の操作によって更新されています。画面を再読み込みしてください。');
        }

        DB::table('notice_categories')
        ->where('id', $id)
        ->where('updated_at', $category->updated_at)
        ->update([
            'name' => $request->validated()['name'],
            'updated_at' => now()
        ]);

        return redirect()->route('admin.notice_categories.index')->with('success', 'お知らせカテゴリ名を変更しました。');
    }

    /**
     * 削除
     */
    public function destroy(Request $request, int $id)
    {
        $category = DB::table('notice_categories')->where('id', $id)->first();

        if (! $category) {
            return back()->with('error', 'このカテゴリは他の操作によって更新されています。画面を再読み込みしてください。');
        }

        $currentUpdatedAt = $request->input('updated_at');

        if ($currentUpdatedAt !== $category->updated_at) {
            return back()->with('error', 'このカテゴリは他の操作によって更新されています。画面を再読み込みしてください。');
        }

        DB::table('notice_categories')
        ->where('id', $id)
        ->where('updated_at', $category->updated_at)
        ->delete();
        
        return redirect()->route('admin.notice_categories.index')->with('success', 'カテゴリを削除しました。');
    }
}
