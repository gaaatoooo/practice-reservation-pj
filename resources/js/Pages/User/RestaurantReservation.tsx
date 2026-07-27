import { Head, useForm, usePage, router } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import RestaurantCancelConfirmModal from '@/components/layout/RestaurantCancelConfirmModal';

interface ReservationItem {
    id: number;
    number: number;
    reservation_date: string;
    reservation_time: string;
    status: number;
}

interface Props {
    reservations: ReservationItem[];
    times: string[];
}

interface PageProps extends Record<string, any> {
    flash: {
        success: string | null;
        error: string | null;
    };
}

export default function RestaurantReservation({ reservations, times }: Props) {
    const { flash } = usePage<PageProps>().props;
    const [flashMessage, setFlashMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    useEffect(() => {
        if (flash.success) {
            setFlashMessage({ type: 'success', text: flash.success });
            const timer = setTimeout(() => setFlashMessage(null), 3000);
            
            return () => clearTimeout(timer);
        }
    }, [flash.success]);

    const { data, setData, post, processing, errors, reset } = useForm({
        date: '',
        time: '',
        number: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/user/restaurant-reservation', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [selectedReservationId, setSelectedReservationId] = useState<number | null>(null);
    const [isCancelling, setIsCancelling] = useState(false);

    const openCancelModal = (id: number) => {
        setSelectedReservationId(id);
        setIsCancelModalOpen(true);
    };

    const handleConfirmCancel = () => {
        if (!selectedReservationId) {
            return;
        }

        setIsCancelling(true);
        router.delete(`/user/restaurant-reservation/${selectedReservationId}`, {
            preserveScroll: true,
            onFinish: () => {
                setIsCancelling(false);
                setIsCancelModalOpen(false);
                setSelectedReservationId(null);
            },
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
            <Head title="レストラン予約" />

            <main className="max-w-5xl mx-auto px-4 py-10">
                <h1 className="text-lg font-bold mb-6">レストラン予約</h1>

                {flashMessage && (
                    <div className={`flex items-center gap-2 px-4 py-3 mb-6 rounded-xl text-sm font-medium shadow-sm ${
                        flashMessage.type === 'success'
                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                            : 'bg-rose-50 border border-rose-200 text-rose-800'
                    }`}>
                        <CheckCircle2 className="w-4 h-4 shrink-0" />
                        <span>{flashMessage.text}</span>
                    </div>
                )}

                {/* ⭕️ 画面上部：予約フォーム */}
                <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-5 mb-10">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="date" className="text-xs font-semibold text-slate-600">日付</label>
                            <input
                                id="date"
                                type="date"
                                value={data.date}
                                onChange={(e) => setData('date', e.target.value)}
                                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                            {errors.date && <p className="text-xs text-rose-600 font-medium">{errors.date}</p>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="time" className="text-xs font-semibold text-slate-600">時間</label>
                            <select
                                id="time"
                                value={data.time}
                                onChange={(e) => setData('time', e.target.value)}
                                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            >
                                <option value="">選択してください</option>
                                {times.map((time) => (
                                    <option key={time} value={time}>{time}</option>
                                ))}
                            </select>
                            {errors.time && <p className="text-xs text-rose-600 font-medium">{errors.time}</p>}
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label htmlFor="number" className="text-xs font-semibold text-slate-600">人数</label>
                            <input
                                id="number"
                                type="number"
                                min={1}
                                value={data.number}
                                onChange={(e) => setData('number', e.target.value)}
                                placeholder="例: 2"
                                className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            />
                            {errors.number && <p className="text-xs text-rose-600 font-medium">{errors.number}</p>}
                        </div>
                    </div>

                    <div className="flex justify-end pt-2 border-t border-slate-100">
                        <button
                            type="submit"
                            disabled={processing}
                            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-lg shadow-sm transition-colors disabled:opacity-50"
                        >
                            {processing ? '予約中...' : '予約する'}
                        </button>
                    </div>
                </form>

                {/* ⭕️ 画面下部：自分の予約一覧 */}
                <div>
                    <h2 className="text-sm font-bold text-slate-700 mb-3">ご予約状況</h2>

                    {reservations.length === 0 ? (
                        <p className="text-sm text-slate-400 py-4">現在、レストランのご予約はありません。</p>
                    ) : (
                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
                            <table className="w-full text-left border-collapse text-sm">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                                        <th className="py-3 px-5">日付</th>
                                        <th className="py-3 px-5">時間</th>
                                        <th className="py-3 px-5 text-right">人数</th>
                                        <th className="py-3 px-5 text-right">ステータス</th>
                                        <th className="py-3 px-5 text-right w-35">操作</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {reservations.map((reservation) => (
                                        <tr key={reservation.id}>
                                            <td className="py-3.5 px-5 font-semibold text-slate-800">
                                                {reservation.reservation_date.replace(/-/g, '/')}
                                            </td>
                                            <td className="py-3.5 px-5 text-slate-700">
                                                {reservation.reservation_time}
                                            </td>
                                            <td className="py-3.5 px-5 text-right">
                                                {reservation.number}名
                                            </td>
                                            <td className="py-3.5 px-5 text-right">
                                                <span className={`text-xs px-2 py-0.5 rounded-md font-semibold ${
                                                    reservation.status === 1
                                                        ? 'bg-blue-100 text-blue-700'
                                                        : 'bg-neutral-100 text-neutral-500'
                                                }`}>
                                                    {reservation.status === 1 ? '予約中' : 'キャンセル済み'}
                                                </span>
                                            </td>
                                            <td className="py-3.5 px-5 text-right w-20">
                                                {reservation.status === 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => openCancelModal(reservation.id)}
                                                        className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 border border-rose-200 hover:border-rose-300 hover:bg-rose-50/50 px-2.5 py-1.5 rounded-lg transition-colors"
                                                    >
                                                        キャンセル
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
            <RestaurantCancelConfirmModal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirm={handleConfirmCancel}
                processing={isCancelling}
                reservationId={selectedReservationId || 0}
            />
        </div>
    );
}