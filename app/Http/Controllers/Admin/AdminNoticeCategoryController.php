<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CategoryRequest;
use Illuminate\Support\Facades\DB;
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

        return redirect()->route('admin.notice_categories.index');
    }

    /**
     * インライン更新
     */
    public function update(CategoryRequest $request, int $id)
    {
        DB::table('notice_categories')->where('id', $id)->update([
            'name' => $request->validated()['name'],
            'updated_at' => now()
        ]);

        return redirect()->route('admin.notice_categories.index');
    }

    /**
     * 削除
     */
    public function destroy(int $id)
    {
        DB::table('notice_categories')->where('id', $id)->delete();
        
        return redirect()->route('admin.notice_categories.index');
    }
}
