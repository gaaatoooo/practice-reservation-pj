<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\HotelDetailRequest;
use App\Models\HotelDetail;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class AdminHotelDetailController extends Controller
{
    /**
     * ホテル情報表示
     */
    public function index(): Response
    {
        $hotelDetail = HotelDetail::query()-> first();

        return Inertia::render('Admin/HotelDetailForm', [
            'hotelDetail' => $hotelDetail,
        ]);
    }

    /**
     * ホテル情報更新
     */
    public function update(HotelDetailRequest $request, HotelDetail $hotelDetail)
    {
        $validated = $request->validated();

        $currentUpdatedAt = $request->input('updated_at');
        $currentCarbon = Carbon::parse($currentUpdatedAt)->setTimezone(config('app.timezone'));

        if ($currentUpdatedAt && !$hotelDetail->updated_at->eq($currentCarbon)) {
            return back()->with('error', 'ホテル詳細情報は他の操作によって更新されています。画面を再読み込みしてください。');
        }

        $hotelDetail->update($validated);

        return redirect()->route('admin.hotel_detail.index')->with('success', 'ホテル詳細情報を更新しました。');
    }
}
