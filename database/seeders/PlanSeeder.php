<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Plan;

class PlanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 宿泊プランのテストデータを3つ用意
        $plans = [
            [
                'id' => 1,
                'name' => '【シンプルステイ】食事なし・素泊まりプラン',
                'description' => 'ビジネスや観光の拠点に最適！スケジュールを自由に組みたい方向けの、最もベーシックでお得な素泊まりプランです。',
            ],
            [
                'id' => 2,
                'name' => '【焼きたてパンが好評】こだわり和洋バイキング朝食付きプラン',
                'description' => '地元の新鮮な食材をふんだんに使用した自慢の朝食バイキング付き。最上階のレストランで清々しい朝をお迎えください。',
            ],
            [
                'id' => 3,
                'name' => '【至高のひととき】総料理長特製ディナー・2食付き極上マスタプラン',
                'description' => '伝統的な技法で仕上げる本格フレンチフルコースディナーを堪能。特別な記念日やご褒美旅行におすすめです。',
            ],
        ];

        // データベースに安全に流し込む（すでにIDが存在する場合は上書き更新）
        foreach ($plans as $plan) {
            Plan::updateOrCreate(
                ['id' => $plan['id']],
                [
                    'name' => $plan['name'],
                    'description' => $plan['description'],
                ]
            );
        }
    }
}
