<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Plan;
use App\Http\Requests\Admin\StorePlanRequest;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

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
        return redirect()->route('admin.plans.index');
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

        $plan->update($data);
        return redirect()->route('admin.plans.index');
    }

    public function destroy(Plan $plan)
    {
        $plan->delete();
        return redirect()->back();
    }
}
