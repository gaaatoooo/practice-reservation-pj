<?php

namespace App\Http\Controllers;

use App\Models\HotelDetail;
use Illuminate\Http\JsonResponse;

class HotelInfoController extends Controller
{
    /**
     * 施設情報の取得API
     */
    public function getInfo(): JsonResponse
    {
        // 最初の1件を取得（なければ空オブジェクト）
        $info = HotelDetail::first() ?? new HotelDetail();

        return response()->json($info);
    }
}
