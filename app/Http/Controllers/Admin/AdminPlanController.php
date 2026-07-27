<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Http\Requests\Admin\StorePlanRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Carbon\Carbon;

class AdminPlanController extends Controller
{
    const PAGINATION_COUNT = 10;

    /**
     * プラン一覧の表示
     */
    public function index(Request $request): Response
    {
        // 最新順にすべてのプランを取得
        $query = Plan::query();

        $statusList = config('constants.Fair.StatusName');

        // 最新順にすべてのプランを取得
        $plans = $query->latest()->paginate(self::PAGINATION_COUNT)->withQueryString();

        return Inertia::render('Admin/PlanList', [
            'plans' => $plans,
            'statusList' => $statusList,
        ]);
    }

    /**
     * 新規プラン作成画面の表示
     */
    public function create(): Response
    {
        $statusList = config('constants.Fair.StatusName');

        return Inertia::render('Admin/PlanForm', [
            'statusList' => $statusList,
        ]);
    }

    /**
     * 新規プランの保存処理
     */
    public function store(StorePlanRequest $request)
    {
        $data = $request->validated();

        Plan::create($data);
        return redirect()->route('admin.plans.index')->with('success', 'プランを登録しました。');
    }

    /**
     * プラン編集画面の表示
     */
    public function edit(Plan $plan): Response
    {
        $statusList = config('constants.Fair.StatusName');

        return Inertia::render('Admin/PlanEditForm', [
            'plan' => $plan,
            'statusList' => $statusList,
        ]);
    }

    /**
     * プランの更新処理
     */
    public function update(StorePlanRequest $request, Plan $plan)
    {
        $data = $request->validated();

        $currentUpdatedAt = $request->input('updated_at');
        $currentCarbon = Carbon::parse($currentUpdatedAt)->setTimezone(config('app.timezone'));

        if ($currentUpdatedAt && !$plan->updated_at->eq($currentCarbon)) {
            return back()->with('error', 'プラン情報は他の操作によって更新されています。画面を再読み込みしてください。');
        }

        $plan->update($data);
        return redirect()->route('admin.plans.index')->with('success', 'プランを更新しました。');
    }

    public function destroy(Request $request, Plan $plan)
    {
        $currentUpdatedAt = $request->input('updated_at');
        $currentCarbon = Carbon::parse($currentUpdatedAt)->setTimezone(config('app.timezone'));

        if ($currentUpdatedAt && !$plan->updated_at->eq($currentCarbon)) {
            return back()->with('error', 'プラン情報は他の操作によって更新されています。画面を再読み込みしてください。');
        }

        $plan->delete();
        return redirect()->back()->with('success', 'プランを削除しました。');
    }
}
