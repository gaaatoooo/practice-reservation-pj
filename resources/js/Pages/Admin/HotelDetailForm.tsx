import { Head, Link, useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { useState } from 'react';
import FlashMessage from '@/components/layout/admin/FlashMessage';

interface HotelDetail {
    id: number;
    postal_code: string;
    address: string;
    tel: string;
    email: string;
    check_in_time: string;
    check_out_time: string;
    description: string;
    amenities: string;
    access_info: string;
    child_policy: string;
    parking_info: string;
    cancel_policy: string;
    updated_at: string;
}

interface Props {
    hotelDetail: HotelDetail;
}

// interface PageProps extends Record<string, any> {
//     flash: {
//         success: string | null;
//         error: string | null;
//     };
// }

export default function AdminHotelDetailEdit({ hotelDetail }: Props) {
    const [flashKey, setFlashKey] = useState(0);

    const { data, setData, patch, processing, errors } = useForm({
        postal_code: hotelDetail.postal_code || '',
        address: hotelDetail.address || '',
        tel: hotelDetail.tel || '',
        email: hotelDetail.email || '',
        check_in_time: hotelDetail.check_in_time || '',
        check_out_time: hotelDetail.check_out_time || '',
        description: hotelDetail.description || '',
        amenities: hotelDetail.amenities || '',
        access_info: hotelDetail.access_info || '',
        child_policy: hotelDetail.child_policy || '',
        parking_info: hotelDetail.parking_info || '',
        cancel_policy: hotelDetail.cancel_policy || '',
        updated_at: hotelDetail.updated_at
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/hotel-detail/${hotelDetail.id}`, {
            onSuccess: () => {
                setFlashKey(prev => prev + 1);
            },
            onError: () => {
                setFlashKey(prev => prev + 1);
            }
        });
    };

    // 共通の入力欄スタイル
    const inputClass = (hasError: boolean) =>
        `w-full text-sm border rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 bg-white placeholder-slate-400 py-2 px-3 transition-colors ${
            hasError ? 'border-rose-400' : 'border-slate-300'
        }`;

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
            <Head title="【管理画面】施設情報編集" />

            {/* 管理画面専用ヘッダー */}
            <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10 text-white">
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="bg-emerald-600 text-xs px-2 py-0.5 rounded font-bold tracking-wider">ADMIN</span>
                        <h1 className="text-md font-bold tracking-tight">施設情報編集</h1>
                    </div>
                    <Link href="/admin/dashboard" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        ダッシュボードへ戻る &rarr;
                    </Link>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-8">
                {/* フラッシュメッセージ */}
                <FlashMessage key={flashKey} />

                <div className="mb-6">
                    <p className="text-sm text-slate-500 mt-1">
                        ホテルの基本情報・各種ポリシーを編集します。
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-8">

                    {/* 基本情報セクション */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-2">基本情報</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1.5">郵便番号</label>
                                <input
                                    type="text"
                                    value={data.postal_code}
                                    onChange={(e) => setData('postal_code', e.target.value)}
                                    placeholder="例: 1000001"
                                    className={inputClass(!!errors.postal_code)}
                                />
                                {errors.postal_code && <p className="text-xs text-rose-600 font-medium mt-1">{errors.postal_code}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1.5">電話番号</label>
                                <input
                                    type="text"
                                    value={data.tel}
                                    onChange={(e) => setData('tel', e.target.value)}
                                    placeholder="例: 0312345678"
                                    className={inputClass(!!errors.tel)}
                                />
                                {errors.tel && <p className="text-xs text-rose-600 font-medium mt-1">{errors.tel}</p>}
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">住所</label>
                            <input
                                type="text"
                                value={data.address}
                                onChange={(e) => setData('address', e.target.value)}
                                placeholder="例: 東京都千代田区〇〇 1-2-3"
                                className={inputClass(!!errors.address)}
                            />
                            {errors.address && <p className="text-xs text-rose-600 font-medium mt-1">{errors.address}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">メールアドレス</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="info@example.com"
                                className={inputClass(!!errors.email)}
                            />
                            {errors.email && <p className="text-xs text-rose-600 font-medium mt-1">{errors.email}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1.5">チェックイン時間</label>
                                <input
                                    type="time"
                                    value={data.check_in_time}
                                    onChange={(e) => setData('check_in_time', e.target.value)}
                                    className={inputClass(!!errors.check_in_time)}
                                />
                                {errors.check_in_time && <p className="text-xs text-rose-600 font-medium mt-1">{errors.check_in_time}</p>}
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-slate-600 mb-1.5">チェックアウト時間</label>
                                <input
                                    type="time"
                                    value={data.check_out_time}
                                    onChange={(e) => setData('check_out_time', e.target.value)}
                                    className={inputClass(!!errors.check_out_time)}
                                />
                                {errors.check_out_time && <p className="text-xs text-rose-600 font-medium mt-1">{errors.check_out_time}</p>}
                            </div>
                        </div>
                    </section>

                    {/* 施設紹介セクション */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-2">施設紹介</h3>

                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">施設説明</label>
                            <textarea
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                rows={4}
                                placeholder="ホテルの特徴やコンセプトなどを入力してください"
                                className={inputClass(!!errors.description)}
                            />
                            {errors.description && <p className="text-xs text-rose-600 font-medium mt-1">{errors.description}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">設備・アメニティ</label>
                            <textarea
                                value={data.amenities}
                                onChange={(e) => setData('amenities', e.target.value)}
                                rows={3}
                                placeholder="Wi-Fi、大浴場、駐車場 など"
                                className={inputClass(!!errors.amenities)}
                            />
                            {errors.amenities && <p className="text-xs text-rose-600 font-medium mt-1">{errors.amenities}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">アクセス情報</label>
                            <textarea
                                value={data.access_info}
                                onChange={(e) => setData('access_info', e.target.value)}
                                rows={3}
                                placeholder="最寄駅からの道順、送迎の有無など"
                                className={inputClass(!!errors.access_info)}
                            />
                            {errors.access_info && <p className="text-xs text-rose-600 font-medium mt-1">{errors.access_info}</p>}
                        </div>
                    </section>

                    {/* 各種ポリシーセクション */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-2">各種ポリシー</h3>

                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">子供に関するポリシー</label>
                            <textarea
                                value={data.child_policy}
                                onChange={(e) => setData('child_policy', e.target.value)}
                                rows={3}
                                placeholder="添い寝の可否、追加料金の有無など"
                                className={inputClass(!!errors.child_policy)}
                            />
                            {errors.child_policy && <p className="text-xs text-rose-600 font-medium mt-1">{errors.child_policy}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">駐車場情報</label>
                            <textarea
                                value={data.parking_info}
                                onChange={(e) => setData('parking_info', e.target.value)}
                                rows={3}
                                placeholder="駐車場の有無、台数、料金など"
                                className={inputClass(!!errors.parking_info)}
                            />
                            {errors.parking_info && <p className="text-xs text-rose-600 font-medium mt-1">{errors.parking_info}</p>}
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-slate-600 mb-1.5">キャンセルポリシー</label>
                            <textarea
                                value={data.cancel_policy}
                                onChange={(e) => setData('cancel_policy', e.target.value)}
                                rows={4}
                                placeholder="キャンセル料の発生タイミングや割合など"
                                className={inputClass(!!errors.cancel_policy)}
                            />
                            {errors.cancel_policy && <p className="text-xs text-rose-600 font-medium mt-1">{errors.cancel_policy}</p>}
                        </div>
                    </section>

                    {/* 更新ボタンのみ（削除ボタンなし） */}
                    <div className="flex justify-end pt-4 border-t border-slate-100">
                        <button
                            type="submit"
                            disabled={processing}
                            className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold px-6 py-2.5 rounded-lg shadow-sm transition-colors disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            <span>{processing ? '更新中...' : '施設情報を更新する'}</span>
                        </button>
                    </div>
                </form>
            </main>
        </div>
    );
}