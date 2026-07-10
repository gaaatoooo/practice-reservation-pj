import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';

// マスタ選択用に必要な型定義
interface User {
    id: number;
    name: string;
    email: string;
}

interface Room {
    id: number;
    name: string;
    price: number;
}

interface Plan {
    id: number;
    name: string;
}

interface Props {
    users: User[];
    rooms: Room[];
    plans: Plan[];
}

export default function AdminReservationCreate({ users, rooms, plans }: Props) {
    // 📝 新規予約作成用フォームの初期値定義
    const { data, setData, post, processing, errors } = useForm({
        user_id: '',
        room_id: '',
        plan_id: '',
        reservation_start_date: '',
        reservation_end_date: '',
        status: 1, // デフォルト: 1 (確定)
        total_price: '',
        admin_memo: '',
        number: ''
    });

    // 部屋が選択された際、自動で基本料金を合計金額の初期値としてセットする補助ロジック
    const handleRoomChange = (roomId: string) => {
        setData(prev => {
            const nextData = { ...prev, room_id: roomId };
            const selectedRoom = rooms.find(r => r.id === Number(roomId));

            if (selectedRoom) {
                nextData.total_price = String(selectedRoom.price);
            }
            
            return nextData;
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/reservations', {
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title="【管理画面】新規予約登録" />

            {/* 💡 引き継ぎ仕様：周囲のカード枠や影をなくし、背景に溶け込むフラットでプレーンなミニマルデザイン */}
            <div className="w-full px-6 py-12 flex flex-col gap-8">
                
                {/* ヘッダー領域 */}
                <div className="flex flex-col gap-3 border-b border-neutral-200 dark:border-neutral-800 pb-6">
                    <div className="flex items-center gap-2 text-xs font-bold tracking-wider text-emerald-600 dark:text-emerald-500">
                        <span>ADMIN</span>
                        <span>•</span>
                        <span>新規予約登録</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <h1 className="text-2xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
                            予約情報の新規作成
                        </h1>
                        <Link 
                            href="/admin/reservations" 
                            className="text-sm font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors self-start sm:self-auto"
                        >
                            &larr; 予約管理一覧へ戻る
                        </Link>
                    </div>
                </div>

                {/* 入力フォーム */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-8 text-sm">
                    
                    {/* 1. 宿泊客・会員の選択 */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 tracking-wider uppercase border-b border-neutral-100 dark:border-neutral-900 pb-1">
                            宿泊客・会員情報
                        </h3>
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="user_id" className="font-semibold text-neutral-700 dark:text-neutral-300">
                                顧客アカウント <span className="text-rose-500">*</span>
                            </label>
                            <select
                                id="user_id"
                                value={data.user_id}
                                onChange={(e) => setData('user_id', e.target.value)}
                                className="w-full bg-transparent border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            >
                                <option value="">-- 対象の宿泊客を選択してください --</option>
                                {users.map((user) => (
                                    <option key={user.id} value={user.id}>
                                        {user.name} ({user.email})
                                    </option>
                                ))}
                            </select>
                            {errors.user_id && <p className="text-xs font-medium text-rose-600 mt-0.5">{errors.user_id}</p>}
                        </div>
                    </div>

                    {/* 2. お部屋・宿泊日程情報 */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 tracking-wider uppercase border-b border-neutral-100 dark:border-neutral-900 pb-1">
                            お部屋・ご宿泊日程
                        </h3>
                        
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="room_id" className="font-semibold text-neutral-700 dark:text-neutral-300">
                                選択するお部屋 <span className="text-rose-500">*</span>
                            </label>
                            <select
                                id="room_id"
                                value={data.room_id}
                                onChange={(e) => handleRoomChange(e.target.value)}
                                className="w-full bg-transparent border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            >
                                <option value="">-- お部屋を選択してください --</option>
                                {rooms.map((room) => (
                                    <option key={room.id} value={room.id}>
                                        {room.name} (基本料金: ¥{room.price})
                                    </option>
                                ))}
                            </select>
                            {errors.room_id && <p className="text-xs font-medium text-rose-600 mt-0.5">{errors.room_id}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="reservation_start_date" className="font-semibold text-neutral-700 dark:text-neutral-300">
                                    チェックイン日 <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="reservation_start_date"
                                    value={data.reservation_start_date}
                                    onChange={(e) => setData('reservation_start_date', e.target.value)}
                                    className="w-full bg-transparent border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-mono"
                                />
                                {errors.reservation_start_date && <p className="text-xs font-medium text-rose-600 mt-0.5">{errors.reservation_start_date}</p>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="reservation_end_date" className="font-semibold text-neutral-700 dark:text-neutral-300">
                                    チェックアウト日 <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="reservation_end_date"
                                    value={data.reservation_end_date}
                                    onChange={(e) => setData('reservation_end_date', e.target.value)}
                                    className="w-full bg-transparent border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-mono"
                                />
                                {errors.reservation_end_date && <p className="text-xs font-medium text-rose-600 mt-0.5">{errors.reservation_end_date}</p>}
                            </div>
                        </div>

                        <h3 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 tracking-wider uppercase border-b border-neutral-100 dark:border-neutral-900 pb-1">
                            ご宿泊プラン
                        </h3>
                        
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="plan_id" className="font-semibold text-neutral-700 dark:text-neutral-300">
                                選択するプラン <span className="text-rose-500">*</span>
                            </label>
                            <select
                                id="plan_id"
                                value={data.plan_id}
                                onChange={(e) => setData('plan_id', e.target.value)}
                                className="w-full bg-transparent border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            >
                                <option value="">-- プランを選択してください --</option>
                                {plans.map((plan) => (
                                    <option key={plan.id} value={plan.id}>
                                        {plan.name}
                                    </option>
                                ))}
                            </select>
                            {errors.plan_id && <p className="text-xs font-medium text-rose-600 mt-0.5">{errors.plan_id}</p>}
                        </div>
                    </div>

                    {/* 宿泊人数 */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 tracking-wider uppercase border-b border-neutral-100 dark:border-neutral-900 pb-1">
                            ご宿泊人数
                        </h3>
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="number" className="font-semibold text-neutral-700 dark:text-neutral-300">
                                人数
                            </label>
                            <input
                                id="number"
                                value={data.number}
                                onChange={(e) => setData('number', e.target.value)}
                                placeholder="ご宿泊人数を入力してください。"
                                className="w-full bg-transparent border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none leading-relaxed"
                            />
                            {errors.number && <p className="text-xs font-medium text-rose-600 mt-0.5">{errors.number}</p>}
                        </div>
                    </div>

                    {/* 3. 金額・ステータス設定 */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 tracking-wider uppercase border-b border-neutral-100 dark:border-neutral-900 pb-1">
                            お支払・ステータス設定
                        </h3>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="total_price" className="font-semibold text-neutral-700 dark:text-neutral-300">
                                    合計金額 (円) <span className="text-rose-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    id="total_price"
                                    value={data.total_price}
                                    onChange={(e) => setData('total_price', e.target.value)}
                                    placeholder="料金を入力、または客室選択で自動入力"
                                    className="w-full bg-transparent border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-mono"
                                />
                                {errors.total_price && <p className="text-xs font-medium text-rose-600 mt-0.5">{errors.total_price}</p>}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="status" className="font-semibold text-neutral-700 dark:text-neutral-300">
                                    予約ステータス <span className="text-rose-500">*</span>
                                </label>
                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={(e) => setData('status', Number(e.target.value))}
                                    className="w-full bg-transparent border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                                >
                                    <option value={1}>確定（予約中）</option>
                                    <option value={2}>キャンセル済</option>
                                </select>
                                {errors.status && <p className="text-xs font-medium text-rose-600 mt-0.5">{errors.status}</p>}
                            </div>
                        </div>
                    </div>

                    {/* 4. 管理者メモ */}
                    <div className="flex flex-col gap-4">
                        <h3 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 tracking-wider uppercase border-b border-neutral-100 dark:border-neutral-900 pb-1">
                            管理用情報
                        </h3>
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="admin_memo" className="font-semibold text-neutral-700 dark:text-neutral-300">
                                管理者メモ
                            </label>
                            <textarea
                                id="admin_memo"
                                value={data.admin_memo}
                                onChange={(e) => setData('admin_memo', e.target.value)}
                                rows={4}
                                placeholder="管理者専用の備忘録や特記事項を入力してください（ユーザー非表示）"
                                className="w-full bg-transparent border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors resize-none leading-relaxed"
                            />
                            {errors.admin_memo && <p className="text-xs font-medium text-rose-600 mt-0.5">{errors.admin_memo}</p>}
                        </div>
                    </div>

                    {/* アクション領域 */}
                    <div className="mt-4 pt-6 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-3">
                        <Link
                            href="/admin/reservations"
                            className="inline-flex items-center justify-center px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs sm:text-sm rounded-lg transition-colors"
                        >
                            キャンセル
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-lg shadow-sm transition-colors disabled:opacity-50"
                        >
                            {processing ? '登録中...' : '予約を新規登録する'}
                        </button>
                    </div>

                </form>
            </div>
        </>
    );
}
