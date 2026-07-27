import { Head, Link, useForm } from '@inertiajs/react';
import React from 'react';
import FlashMessage from '@/components/layout/admin/FlashMessage';

interface stock {
    id: number;
    date: string;
    time: string;
    capacity: number;
    updated_at: string;
}

interface ReservationItem {
    id: number;
    number: number;
    status: number;
    user: {
        name: string;
    };
}

interface Props {
    stock: stock;
    reservations: ReservationItem[];
    times: string[];
}

export default function AdminRestaurantReservationEdit({ stock, reservations, times }: Props) {

    const { data, setData, patch, processing, errors } = useForm({
        date: stock.date,
        time: stock.time.slice(0, 5),
        capacity: stock.capacity,
        updated_at: stock.updated_at,
    });

    console.log(stock);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/restaurant_reservations/${stock.id}`, {
            preserveScroll: true,
            onSuccess: (page) => {
                // サーバーから新しく返ってきた updated_at を、フォームの状態に反映する
                // これにより、連続で送信しても常に最新の updated_at が送信されるようになります
                const updatedStock = page.props.stock as stock;
                
                if (updatedStock && updatedStock.updated_at) {
                    setData('updated_at', updatedStock.updated_at);
                }
            }
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
            <Head title="【管理画面】予約枠編集" />

            <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10 text-white">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="bg-emerald-600 text-xs px-2 py-0.5 rounded font-bold tracking-wider">ADMIN</span>
                        <h1 className="text-md font-bold tracking-tight">予約枠編集</h1>
                    </div>
                    <Link href="/admin/restaurant_reservations" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        &larr; 管理一覧へ戻る
                    </Link>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8">
                
                <FlashMessage />

                <div className="mb-6">
                    <p className="text-sm text-slate-500 mt-1">
                        予約枠情報を編集します。
                    </p>
                </div>

                {/* 編集フォーム */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-8 text-sm">

                    {/* 日付 */}
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="date" className="font-semibold text-neutral-700 dark:text-neutral-300">
                                日付
                            </label>
                            <input
                                id="date"
                                type="date"
                                value={data.date}
                                onChange={(e) => setData('date', e.target.value)}
                                className="w-full bg-transparent border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            />
                            {errors.date && <p className="text-xs font-medium text-rose-600 mt-0.5">{errors.date}</p>}
                        </div>
                    </div>

                    {/* 時間：編集時は単一選択（プルダウン） */}
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="time" className="font-semibold text-neutral-700 dark:text-neutral-300">
                                時間
                            </label>
                            <select
                                id="time"
                                value={data.time}
                                onChange={(e) => setData('time', e.target.value)}
                                className="w-full bg-transparent border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            >
                                {times.map((time) => (
                                    <option key={time} value={time}>{time}</option>
                                ))}
                            </select>
                            {errors.time && <p className="text-xs font-medium text-rose-600 mt-0.5">{errors.time}</p>}
                            {reservations.length > 0 && (
                                <p className="text-xs text-amber-600 mt-1">
                                    ※ この枠にはすでに予約が入っています。時間を変更すると既存の予約と齟齬が生じる可能性があります。
                                </p>
                            )}
                        </div>
                    </div>

                    {/* 最大許容人数 */}
                    <div className="flex gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="capacity" className="font-semibold text-neutral-700 dark:text-neutral-300">
                                最大許容人数
                            </label>
                            <input
                                id="capacity"
                                type="number"
                                min={1}
                                value={data.capacity}
                                onChange={(e) => setData('capacity', Number(e.target.value))}
                                className="w-full bg-transparent border border-neutral-300 dark:border-neutral-700 rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                            />
                            {errors.capacity && <p className="text-xs font-medium text-rose-600 mt-0.5">{errors.capacity}</p>}
                        </div>
                    </div>

                    {/* アクション領域 */}
                    <div className="mt-4 pt-6 border-t border-neutral-200 dark:border-neutral-800 flex justify-end gap-3">
                        <Link
                            href="/admin/restaurant_reservations"
                            className="inline-flex items-center justify-center px-5 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-bold text-xs sm:text-sm rounded-lg transition-colors"
                        >
                            キャンセル
                        </Link>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm rounded-lg shadow-sm transition-colors disabled:opacity-50"
                        >
                            {processing ? '更新中...' : '予約枠を更新する'}
                        </button>
                    </div>
                </form>

                {/* ⭕️ 登録済み予約の一覧（編集不可・閲覧のみ） */}
                <div className="mt-12">
                    <h3 className="text-xs font-bold text-neutral-400 dark:text-neutral-500 tracking-wider uppercase border-b border-neutral-100 dark:border-neutral-900 pb-1 mb-4">
                        この枠への予約状況
                    </h3>

                    {reservations.length === 0 ? (
                        <p className="text-sm text-neutral-400 py-4">この枠への予約はまだありません。</p>
                    ) : (
                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                                        <th className="py-3 px-5 w-20">ID</th>
                                        <th className="py-3 px-5">予約者名</th>
                                        <th className="py-3 px-5 text-right">人数</th>
                                        <th className="py-3 px-5 text-right">ステータス</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {reservations.map((reservation) => (
                                        <tr key={reservation.id}>
                                            <td className="py-3.5 px-5 font-mono text-slate-400 align-middle">
                                                #{reservation.id}
                                            </td>
                                            <td className="py-3.5 px-5 align-middle font-semibold text-slate-800">
                                                {reservation.user.name}
                                            </td>
                                            <td className="py-3.5 px-5 text-right align-middle">
                                                {reservation.number}名
                                            </td>
                                            <td className="py-3.5 px-5 text-right align-middle">
                                                <span className={`text-xs px-2 py-0.5 rounded-md font-semibold ${
                                                    reservation.status === 1
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-neutral-100 text-neutral-500'
                                                }`}>
                                                    {reservation.status === 1 ? '予約中' : 'キャンセル済み'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}