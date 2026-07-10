<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Room;
use App\Models\RoomAvailability;

class RoomAvailabilitySeeder extends Seeder
{
    public function run(): void
    {
        // 1. まずは客室データを3つ作成
        $single = Room::updateOrCreate(['id' => 1], [
            'name' => 'スタンダード・シングルルーム',
            'price' => 8000,
            'capacity' => 1,
            'total_rooms' => 10,
            'description' => 'ビジネスや一人旅に最適な、シンプルで機能的なお部屋です。快適なWi-Fi環境も完備。',
            'status' => true
        ]);

        $twin = Room::updateOrCreate(['id' => 2], [
            'name' => 'デラックス・ツインルーム',
            'price' => 15000,
            'capacity' => 2,
            'total_rooms' => 10,
            'description' => 'ご友人やカップルでのご旅行に最適な、広々としたツインベッドのお部屋です。',
            'status' => true
        ]);

        $suite = Room::updateOrCreate(['id' => 3], [
            'name' => 'エグゼクティブ・スイートルーム',
            'price' => 45000,
            'capacity' => 4,
            'total_rooms' => 10,
            'description' => '最上階からの夜景を一望できる、当ホテル最高級のラグジュアリーなお部屋です。',
            'status' => true
        ]);

        // 2. 2026年7月1日の空室状況データ（シングルとツインは空いているが、スイートは満室にする）
        $datas = [
            // 7月1日：シングルは2部屋予約（残り8室＝○）、ツインは4部屋予約（残り1室＝残り5室以下なので△）
            ['room_id' => $single->id, 'date' => '2026-07-01', 'reserved_count' => 2],
            ['room_id' => $twin->id,   'date' => '2026-07-01', 'reserved_count' => 4],
            
            // 7月2日：シングルは10部屋予約（残り0室＝満室×）
            ['room_id' => $single->id, 'date' => '2026-07-02', 'reserved_count' => 10],
        ];

        foreach ($datas as $data) {
            RoomAvailability::updateOrCreate(
                ['room_id' => $data['room_id'], 'date' => $data['date']],
                ['reserved_count' => $data['reserved_count']]
            );
        }
    }
}
