<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Http\Requests\Admin\StoreRoomRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class AdminRoomController extends Controller
{
    const PAGINATION_COUNT = 10;

    /**
     * 部屋一覧の表示
     */
    public function index(Request $request): Response
    {
        // 検索パラメータの取得
        $name = $request->query('name');
        $status = $request->query('status');

        // 最新順にすべての部屋を取得
        $query = Room::query();

        // 2. ステータスで検索 (完全一致)
        if (!empty($status)) {
            $query->where('status', $status);
        }

        // 3. フェアタイトルで検索 (あいまい検索)
        if (!empty($name)) {
            $pat = '%' . addcslashes($name, '%_\\') . '%';
            $query->where('name', 'like', '%' . $pat . '%');
        }

        // 最新順にすべての部屋を取得
        $rooms = $query->latest()->paginate(self::PAGINATION_COUNT)->withQueryString();

        $statusList = config('constants.Room.StatusName');

        return Inertia::render('Admin/RoomList', [
            'rooms' => $rooms,
            'filters' => $request->only(['name', 'status']), // フォームの初期値保持用
            'statusList' => $statusList
        ]);
    }

    /**
     * 新規部屋作成画面の表示
     */
    public function create(): Response
    {
        $statusList = config('constants.Room.StatusName');

        return Inertia::render('Admin/RoomForm', [
            'statusList' => $statusList
        ]);
    }

    /**
     * 新規部屋の保存処理
     */
    public function store(StoreRoomRequest $request)
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

        Room::create($data);
        return redirect()->route('admin.rooms.index');
    }

    /**
     * 部屋編集画面の表示
     */
    public function edit(Room $room): Response
    {
        $statusList = config('constants.Room.StatusName');
        
        return Inertia::render('Admin/RoomEditForm', [
            'room' => $room,
            'statusList' => $statusList
        ]);
    }

    /**
     * 部屋の更新処理
     */
    public function update(StoreRoomRequest $request, Room $room)
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

        $room->update($data);
        return redirect()->route('admin.rooms.index');
    }

    public function destroy(Room $room)
    {
        $room->delete();
        return redirect()->back();
    }
}
