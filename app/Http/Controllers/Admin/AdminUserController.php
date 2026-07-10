<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Http\Requests\Admin\StoreUserRequest;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class AdminUserController extends Controller
{
    /**
     * 管理者一覧の表示
     */
    public function index(): Response
    {
        // role = 2 (管理者) のみを最新順に取得（カード枠なしのフラットデザイン表示用）
        $admins = User::where('role', 2)
            ->orderBy('id', 'desc')
            ->paginate(15);

        return Inertia::render('Admin/UserList', [
            'admins' => $admins
        ]);
    }

    /**
     * 管理者登録画面の表示
     */
    public function create(): Response
    {
        return Inertia::render('Admin/UserCreate');
    }

    /**
     * 新規管理者の登録実行
     */
    public function store(StoreUserRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        // DBへの保存オブジェクトを作成
        $user = new User();
        $user->fill($validated);

        $user->role = 2;

        $user->save();

        return redirect()->route('admin.users.index')
            ->with('status', '管理者を新規登録しました。');
    }

    /**
     * 管理者編集画面の表示
     */
    public function edit(User $user): Response
    {
        // セキュリティチェック: 操作対象が管理者(2)でなければ一覧へ戻す
        if ($user->role !== 2) {
            abort(404);
        }

        $is_self = false;
        if ( $user->id == Auth::user()->id ) {
            $is_self = true;
        }

        return Inertia::render('Admin/UserEdit', [
            'admin' => $user,
            'is_self' => $is_self,
        ]);
    }

    /**
     * 管理者情報の更新実行
     */
    public function update(StoreUserRequest $request, User $user): RedirectResponse
    {
        if ($user->role !== 2) {
            abort(404);
        }

        $validated = $request->validated();

        $user->update($validated);

        return redirect()->route('admin.users.index')
            ->with('status', '管理者情報を更新しました。');
    }

    /**
     * 管理者の削除（自分自身は削除不可）
     */
    public function destroy(User $user): RedirectResponse
    {
        if ($user->role !== 2) {
            abort(404);
        }

        // 🔐 セキュアガード：現在ログイン中の自分自身は削除できないロジック
        if (auth()->id() === $user->id) {
            return redirect()->back()->with('error', 'ログイン中の自身のアカウントは削除できません。');
        }

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('status', '管理者を削除しました。');
    }
}
