import { router } from '@inertiajs/react'; // ⭕️ Inertiaの高速ルーターをインポート
import { type AvailableRoom } from './RoomAvailabilityCard';

// 部屋データの型定義
export type AvailableRoom = {
    id: number;
    name: string;
    price: number;
    capacity: number;
    description: string;
    status: number; // ⭕️ 数値（1=ok, 2=few）で管理
};

type CardProps = {
    room: AvailableRoom;
    dateStr: string;
};

export default function RoomAvailabilityCard({ room, dateStr }: CardProps) {
    if (!room) return null;
    
    // ⭕️ 数値（1, 2）に合わせてバッジの文字と色を判定
    const isOk = room.status === 1;
    const badgeText = isOk ? '空室あり' : '残りわずか';
    const badgeStyle = isOk
        ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400';

    // ⭕️ ボタンが押されたときに動くジャンプ関数
    const handleGoToReservation = () => {
        // Inertia.jsの機能を使って、日付と部屋のIDをパラメータに乗せて画面遷移させます
        router.get(`/user/reservation?date=${dateStr}&room_id=${room.id}`);
    };

    return (
        <div className="p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all">
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-neutral-900 dark:text-neutral-100">{room.name}</h4>
                    <span className={`text-xs px-2 py-0.5 rounded font-bold ${badgeStyle}`}>
                        {badgeText}
                    </span>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2 line-clamp-2">
                    {room.description || 'この部屋の説明はありません。'}
                </p>
                <div className="flex gap-4 text-xs text-neutral-400">
                    <span>定員: {room.capacity}名</span>
                    <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                        価格: ¥{room.price.toLocaleString()}〜 / 泊
                    </span>
                </div>
            </div>
            
            {/* 予約手続きボタン */}
            <button 
                onClick={handleGoToReservation}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-4 py-2 rounded-lg shadow transition-colors whitespace-nowrap self-stretch sm:self-auto flex items-center justify-center"
            >
                予約手続きへ
            </button>
        </div>
    );
}
