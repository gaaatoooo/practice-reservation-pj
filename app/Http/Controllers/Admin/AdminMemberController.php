<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Http\Requests\Admin\StoreMemberRequest;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Carbon\Carbon;

class AdminMemberController extends Controller
{
    /**
     * ユーザー一覧の表示
     */
    public function index(Request $request)
    {
        // 1. クエリのビルダ初期化（強制退会/論理削除済みのユーザーを考慮する場合は scope 等を適用）
        $query = User::query()->where('role', 1);

        // 2. 氏名のあいまい検索
        if ($request->filled('name')) {
            $query->where('name', 'LIKE', '%' . $request->name . '%');
        }

        // 3. 電話番号のあいまい検索
        if ($request->filled('tel')) {
            $query->where('tel', 'LIKE', '%' . $request->tel . '%');
        }

        // ⭕️ ステータス検索（1: 有効, 3: 退会済み）
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // 4. 【要件】CSV出力フラグがある場合はストリーム出力して処理を終了
        if ($request->input('export') === 'csv') {
            if (!$query->exists()) {
                return redirect()->back()
                    ->with('error', '出力対象のデータが存在しないため、CSVを出力できません。');
            }

            return $this->exportCsv($query);
        }

        // 5. 通常の一覧表示（ページネーション 20件）
        $members = $query->latest('id')->paginate(20)->withQueryString();

        // 6. フロントエンド（Inertia）にデータを渡す
        return Inertia::render('Admin/MemberList', [
            'members' => $members,
            'filters' => $request->only(['name', 'tel', 'status']),
            'status' => session('status'),
            'error' => session('error'),
        ]);
    }

    /**
     * CSVエクスポート処理 (StreamedResponseによるメモリ節約対応)
     */
    private function exportCsv($query): StreamedResponse
    {
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="members_' . date('YmdHis') . '.csv"',
            'Pragma' => 'no-cache',
            'Cache-Control' => 'must-revalidate, post-check=0, pre-check=0',
            'Expires' => '0',
        ];

        return response()->stream(function () use ($query) {
            $handle = fopen('php://output', 'w');
            
            // Excel等での文字化けを防ぐためBOMを出力
            fwrite($handle, "\xEF\xBB\xBF");

            // CSVのヘッダー行
            fputcsv($handle, ['ID', '会員名', 'メールアドレス', '電話番号', '郵便番号', '住所', '性別（1:男、2:女）', '生年月日', 'ステータス（1:有効、3:退会）', '退会日時', '登録日']);

            // 【要件】検索にヒットした全件データを小分け（chunk）にしてメモリ負荷を抑えて出力
            $query->latest('id')->chunk(500, function ($members) use ($handle) {
                foreach ($members as $member) {
                    fputcsv($handle, [
                        $member->id,
                        $member->name,
                        $member->email,
                        $member->tel,
                        $member->zip,
                        $member->address,
                        $member->sex,
                        $member->birthday,
                        $member->status,
                        $member->deleted_at,
                        $member->created_at->format('Y-m-d H:i:s'),
                    ]);
                }
            });

            fclose($handle);
        }, 200, $headers);
    }

    /**
     * ユーザー編集画面の表示
     */
    public function edit(int $id)
    {
        $member = User::findOrFail($id);

        return Inertia::render('Admin/MemberEdit', [
            'member' => $member,
        ]);
    }

    /**
     * ユーザー情報の更新実行
     */
    public function update(StoreMemberRequest $request, int $id)
    {
        // 1. 対象の会員を取得
        $user = User::findOrFail($id);

        // 2. フォームリクエストで検証済みのデータのみを抽出
        $validated = $request->validated();

        // 3. 更新処理を実行
        $user->update($validated);

        return redirect()->route('admin.members.index')
            ->with('status', '会員情報を更新しました。');
    }

    /**
     * ユーザーの論理削除
     */
    public function destroy(int $id)
    {
        try {
            $member = User::findOrFail($id);

            $member->update([
                'deleted_at' => Carbon::now(),
                'status'     => 3  // 削除
            ]); 

            return redirect()->route('admin.members.index')
                ->with('status', "会員「{$member->name}」に強制退会処理を実行しました。");

        } catch (\Exception $e) {
            return redirect()->route('admin.members.index')
                ->with('error', '強制退会処理に失敗しました。時間をおいて再度お試しください。');
        }
    }
}
