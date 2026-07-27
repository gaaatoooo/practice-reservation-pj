import { Head, Link, useForm } from '@inertiajs/react';

interface Props {
    times: string[];
}

export default function AdminRestaurantReservationCreate({ times }: Props) {

    // 📝 新規予約枠作成用フォームの初期値定義
    const { data, setData, post, processing, errors } = useForm({
        date: '',
        times: [] as string[],
        capacity: '',
    });

    // チェックボックスのON/OFF切り替え
    const toggleTime = (time: string) => {
        if (data.times.includes(time)) {
            setData('times', data.times.filter((t) => t !== time));
        } else {
            setData('times', [...data.times, time]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/restaurant_reservations', {
            preserveScroll: true,
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
            <Head title="【管理画面】新規予約枠登録" />

            <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10 text-white">
                <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="bg-emerald-600 text-xs px-2 py-0.5 rounded font-bold tracking-wider">ADMIN</span>
                        <h1 className="text-md font-bold tracking-tight">新規予約枠登録</h1>
                    </div>
                    <Link href="/admin/restaurant_reservations" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        &larr; 管理一覧へ戻る
                    </Link>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 py-8">
                <div className="mb-6">
                    <p className="text-sm text-slate-500 mt-1">
                        予約枠情報を入力して保存します。同じ日付・人数で複数の時間帯をまとめて登録できます。
                    </p>
                </div>

                <div>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-8 text-sm">

                        {/* 日付：ネイティブのカレンダー入力 */}
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

                        {/* 時間：constants.phpの定義値をチェックボックスでループ表示 */}
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <span className="font-semibold text-neutral-700 dark:text-neutral-300">
                                    時間（複数選択可）
                                </span>
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-1">
                                    {times.map((time) => (
                                        <label
                                            key={time}
                                            className={`flex items-center justify-center gap-1.5 border rounded-lg px-3 py-2 cursor-pointer text-sm font-medium transition-colors ${
                                                data.times.includes(time)
                                                    ? 'bg-blue-600 border-blue-600 text-white'
                                                    : 'bg-transparent border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-blue-400'
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={data.times.includes(time)}
                                                onChange={() => toggleTime(time)}
                                                className="sr-only"
                                            />
                                            {time}
                                        </label>
                                    ))}
                                </div>
                                {errors.times && <p className="text-xs font-medium text-rose-600 mt-0.5">{errors.times}</p>}
                            </div>
                        </div>

                        {/* 最大許容人数 */}
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label htmlFor="number" className="font-semibold text-neutral-700 dark:text-neutral-300">
                                最大許容人数
                                </label>
                                <input
                                    id="capacity"
                                    type="number"
                                    min={1}
                                    value={data.capacity}
                                    onChange={(e) => setData('capacity', e.target.value)}
                                    placeholder="最大許容人数を入力してください。"
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
                                {processing ? '登録中...' : '予約枠を新規登録する'}
                            </button>
                        </div>

                    </form>
                </div>
            </main>
        </div>
    );
}