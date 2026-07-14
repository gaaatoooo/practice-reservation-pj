import { Head, Link, useForm } from '@inertiajs/react';
import { differenceInDays } from 'date-fns';
import React, { useState, useEffect } from 'react';
import CancelConfirmModal from '@/components/layout/admin/CancelConfirmModal';
import CheckinConfirmModal from '@/components/layout/admin/CheckinConfirmModal';

interface User {
    id: number;
    name: string;
    email: string;
    tel?: string;
    zipcode?: string;
    address?: string;
    gender?: string;
    birthday?: string;
}

interface Room {
    id: number;
    name: string;
    price: number;
}

interface Plan {
    id: number;
    name: string;
    price: number;
}

interface Reservation {
    id: number;
    user_id: number;
    room_id: number;
    plan_id: number;
    reservation_start_date: string;
    reservation_end_date: string;
    status: number; // 1: 確定, 2: キャンセル済
    total_price: number;
    admin_memo: string | null;
    created_at: string;
    cancel_date: string;
    user: User;
    room: Room;
    number: number;
    plan: Plan;
}

interface Props {
    reservation: Reservation;
    plans: Plan[];
    rooms: Room[];
}

export default function AdminReservationDetail({ reservation, rooms, plans }: Props) {
    // ⚠️ チェックイン確認モーダルの開閉ステートを追加（コンポーネント上部に記述）
    const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);

    // 🟢 チェックインリクエスト用フォームフックを追加（コンポーネント上部に記述）
    const checkinForm = useForm({});

    // チェックイン実行ハンドラ
    const handleCheckinSubmit = () => {
        checkinForm.patch(`/admin/reservations/${reservation.id}/checkin`, {
            preserveScroll: true,
            onSuccess: () => setIsCheckinModalOpen(false),
        });
    };

    const isCancelled = reservation.status === 2;

    // ⚠️ キャンセル確認モーダルの開閉ステート
    const [isModalOpen, setIsModalOpen] = useState(false);

    // 📝 予約変更用の一括統合フォームフック
    const { data, setData, patch, processing, errors } = useForm({
        reservation_start_date: reservation.reservation_start_date || '',
        reservation_end_date: reservation.reservation_end_date || '',
        total_price: reservation.total_price || 0,
        admin_memo: reservation.admin_memo || '',
        number: reservation.number || '',
        plan_id: reservation.plan_id || '',
        room_id: reservation.room_id || '',
    });

    // 🔴 キャンセルリクエスト用フォーム
    const cancelForm = useForm({});

    // ⭕️ 人数、または選択プランが変更された際に合計金額をリアルタイム動的再計算するロジック
    useEffect(() => {
        // 1. 画面のセレクトボックスで選択されているお部屋の料金を取得（マスタから検索）
        const selectedRoom = rooms?.find(r => r.id === Number(data.room_id));
        const selectedPlan = plans.find(p => p.id === Number(data.plan_id));
        // マスタにあればその料金、なければ初期データの料金をフォールバックとして使用
        const roomPrice = selectedRoom ? (selectedRoom.price || selectedRoom.price || 0) : (reservation.room?.price || reservation.room?.price || 0);
        const planPrice = selectedPlan ? (selectedPlan.price || selectedPlan.price || 0) : (reservation.plan?.price || reservation.plan?.price || 0);

        let nights = 1;

        if (data.reservation_start_date && data.reservation_end_date) {
            const checkInDate = new Date(data.reservation_start_date);
            const checkOutDate = new Date(data.reservation_end_date);
        
            if (!isNaN(checkInDate.getTime()) && !isNaN(checkOutDate.getTime())) {
                const calculatedNights = differenceInDays(checkOutDate, checkInDate);
                        
                if (calculatedNights > 0) {
                    nights = calculatedNights;
                }
            }
        }

        // 3. 宿泊人数の取得
        const count = Number(data.number) || 1;

        // 【計算式】 （お部屋基本単価 × 人数） ＋ プランアドオン料金
        const calculatedTotal = (roomPrice + planPrice) * count * nights;
        
        // 4. フォームの total_price を更新（右側の巨大金額表示にも即時連動）
        setData('total_price', calculatedTotal);

    }, [data.room_id, data.plan_id, data.number, data.reservation_start_date, data.reservation_end_date]);

    // 予約情報の一括更新ハンドラ
    const handleUpdateSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch(`/admin/reservations/${reservation.id}`, {
            preserveScroll: true,
        });
    };

    // 代理キャンセル実行ハンドラ
    const handleCancelSubmit = () => {
        cancelForm.patch(`/admin/reservations/${reservation.id}/cancel`, {
            preserveScroll: true,
            onSuccess: () => setIsModalOpen(false),
        });
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
            <Head title={`【管理画面】予約詳細 #${reservation.id}`} />

            {/* 管理画面専用ヘッダー */}
            <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10 text-white">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="bg-emerald-600 text-xs px-2 py-0.5 rounded font-bold tracking-wider">ADMIN</span>
                        <h1 className="text-md font-bold tracking-tight">予約詳細確認</h1>
                    </div>
                    <Link href="/admin/reservations" className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                        &larr; 予約管理一覧へ戻る
                    </Link>
                </div>
            </header>

            {/* メインコンテンツ */}
            <main className="max-w-4xl mx-auto px-4 py-8">
                <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold tracking-tight text-slate-900">予約情報 #{reservation.id}</h2>
                            <span className={`text-xs px-2.5 py-1 rounded-md font-semibold border ${
                                isCancelled ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            }`}>
                                {isCancelled ? 'キャンセル済' : '確定（予約中）'}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <p className="text-sm text-slate-500 mt-1">
                                申込日時: {new Date(reservation.created_at).toLocaleString('ja-JP')}
                            </p>
                            {reservation.status === 2 && reservation.cancel_date &&(
                                <p className="text-sm text-slate-500 mt-1">
                                    キャンセル日時: {new Date(reservation.cancel_date).toLocaleString('ja-JP')}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {/* ⭕️ チェックイン済みボタン（未キャンセル、かつ、まだチェックイン前(status !== 3)の場合のみ表示） */}
                        {!isCancelled && reservation.status !== 3 && (
                            <button
                                type="button"
                                onClick={() => setIsCheckinModalOpen(true)}
                                className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold px-4 py-2.5 rounded-lg shadow-sm transition-colors text-center"
                            >
                                チェックイン済みにする
                            </button>
                        )}
                        {/* 🔴 代理キャンセルボタン（未キャンセルの場合のみ表示） */}
                        {!isCancelled && (
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(true)}
                                className="bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold px-4 py-2.5 rounded-lg shadow-sm transition-colors text-center"
                            >
                                代理キャンセルを実行する
                            </button>
                        )}
                    </div>
                </div>
                <form onSubmit={handleUpdateSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* 左・中央側：詳細情報カード */}
                    <div className="md:col-span-2 space-y-6">
                        {/* 宿泊客の基本情報 */}
                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
                            <h3 className="text-sm font-bold text-slate-400 tracking-wider border-b border-slate-100 pb-2 mb-4">
                                宿泊客・会員情報
                            </h3>
                            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 text-sm">
                                <div>
                                    <dt className="text-slate-500 font-medium">お名前</dt>
                                    <dd className="text-base font-bold text-slate-800 mt-0.5">{reservation.user?.name}</dd>
                                </div>
                                <div>
                                    <dt className="text-slate-500 font-medium">メールアドレス</dt>
                                    <dd className="text-slate-800 mt-0.5 font-mono">{reservation.user?.email}</dd>
                                </div>
                                <div>
                                    <dt className="text-slate-500 font-medium">電話番号</dt>
                                    <dd className="text-slate-800 mt-0.5 font-mono">{reservation.user?.tel || '未登録'}</dd>
                                </div>
                                <div>
                                    <dt className="text-slate-500 font-medium">生年月日</dt>
                                    <dd className="text-slate-800 mt-0.5">{reservation.user?.birthday || '未登録'}</dd>
                                </div>
                                <div className="sm:col-span-2">
                                    <dt className="text-slate-500 font-medium">住所</dt>
                                    <dd className="text-slate-800 mt-0.5">
                                        {reservation.user?.zipcode && `〒${reservation.user.zipcode} `}
                                        {reservation.user?.address || '未登録'}
                                    </dd>
                                </div>
                            </dl>
                        </div>

                        {/* 客室・宿泊日程情報（編集可能へ変更） */}
                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-4">
                            <h3 className="text-sm font-bold text-slate-400 tracking-wider border-b border-slate-100 pb-2">
                                お部屋・ご宿泊日程編集
                            </h3>
                                
                            <div className="flex flex-col gap-1.5 text-sm">
                                <label htmlFor="room_id" className="text-slate-500 font-medium">
                                    選択されたお部屋
                                </label>
                                <select
                                    id="room_id"
                                    value={data.room_id}
                                    onChange={(e) => setData('room_id', e.target.value)}
                                    className="border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-slate-900 text-slate-800 bg-white"
                                >
                                    {rooms.map((room) => (
                                        <option key={room.id} value={room.id}>
                                            {room.name} (基本単価: ¥{room.price})
                                        </option>
                                    ))}
                                </select>
                                {errors.room_id && <p className="text-xs text-rose-600 mt-0.5">{errors.room_id}</p>}
                            </div>

                            <div className="flex flex-col gap-1.5 text-sm">
                                <label htmlFor="plan_id" className="text-slate-500 font-medium">
                                    適用プラン
                                </label>
                                <select
                                    id="plan_id"
                                    value={data.plan_id}
                                    onChange={(e) => setData('plan_id', e.target.value)}
                                    className="border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-slate-900 text-slate-800 bg-white"
                                >
                                    {plans.map((plan) => (
                                        <option key={plan.id} value={plan.id}>
                                            {plan.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.plan_id && <p className="text-xs text-rose-600 mt-0.5">{errors.plan_id}</p>}
                                </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="reservation_start_date" className="text-slate-500 font-medium">
                                        チェックイン日
                                    </label>
                                    <input
                                        type="date"
                                        id="reservation_start_date"
                                        value={data.reservation_start_date}
                                        onChange={(e) => setData('reservation_start_date', e.target.value)}
                                        className="border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-slate-900 font-mono text-slate-800"
                                    />
                                    {errors.reservation_start_date && <p className="text-xs text-rose-600 mt-0.5">{errors.reservation_start_date}</p>}
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="reservation_end_date" className="text-slate-500 font-medium">
                                        チェックアウト日
                                    </label>
                                    <input
                                        type="date"
                                        id="reservation_end_date"
                                        value={data.reservation_end_date}
                                        onChange={(e) => setData('reservation_end_date', e.target.value)}
                                        className="border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-slate-900 font-mono text-slate-800"
                                    />
                                    {errors.reservation_end_date && <p className="text-xs text-rose-600 mt-0.5">{errors.reservation_end_date}</p>}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div className="flex flex-col gap-1.5">
                                    <label htmlFor="number" className="text-slate-500 font-medium">
                                        ご宿泊人数
                                    </label>
                                    <input
                                        type="number"
                                        id="number"
                                        min="1"
                                        value={data.number}
                                        onChange={(e) => setData('number', Math.max(1, Number(e.target.value)))}
                                        className="border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-slate-900 font-mono text-slate-800"
                                    />
                                    {errors.number && <p className="text-xs text-rose-600 mt-0.5">{errors.number}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 右側：合計金額・ステータス操作サイドパネル */}
                    <div className="space-y-6">
                        <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 text-center">
                            <span className="text-xs text-slate-400 font-bold block mb-1">決済合計金額</span>
                            <span className="text-3xl font-black text-slate-900 tracking-tight">
                                ¥{reservation.total_price.toLocaleString()}
                            </span>
                            <span className="text-xs text-slate-500 block mt-0.5">（消費税・サービス料込）</span>
                        </div>
                        {/* 右側：金額変更・管理者メモ・一括保存パネル */}
                        <div className="space-y-6">
                            {/* 金額・メモ編集エリア */}
                            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 space-y-5">
                                <h3 className="text-sm font-bold text-slate-400 tracking-wider border-b border-slate-100 pb-2">
                                    料金・管理用メモ
                                </h3>

                                <div className="flex flex-col gap-1.5 text-sm">
                                    <label htmlFor="total_price" className="text-slate-500 font-medium">
                                        合計金額 (円)
                                    </label>
                                    <input
                                        type="number"
                                        id="total_price"
                                        value={data.total_price}
                                        onChange={(e) => setData('total_price', Number(e.target.value))}
                                        className="border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-slate-900 font-mono text-base font-bold text-slate-800"
                                    />
                                    {errors.total_price && <p className="text-xs text-rose-600 mt-0.5">{errors.total_price}</p>}
                                </div>

                                <div className="flex flex-col gap-1.5 text-sm">
                                    <label htmlFor="admin_memo" className="text-slate-500 font-medium">
                                        管理者専用メモ
                                    </label>
                                    <textarea
                                        id="admin_memo"
                                        value={data.admin_memo}
                                        onChange={(e) => setData('admin_memo', e.target.value)}
                                        rows={5}
                                        placeholder="特記事項を入力してください"
                                        className="border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-slate-900 text-slate-800 resize-none leading-relaxed text-sm"
                                    />
                                    {errors.admin_memo && <p className="text-xs text-rose-600 mt-0.5">{errors.admin_memo}</p>}
                                </div>

                                {/* 更新実行アクションボタン */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold py-2.5 rounded-lg shadow-sm transition-colors text-center disabled:opacity-50"
                                >
                                    {processing ? '変更内容を保存中...' : '予約変更内容を保存する'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </main>

            {/* 代理キャンセルモーダルコンポーネント */}
            <CancelConfirmModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleCancelSubmit}
                processing={cancelForm.processing}
                reservationId={reservation.id} 
            />
            <CheckinConfirmModal
                isOpen={isCheckinModalOpen}
                onClose={() => setIsCheckinModalOpen(false)}
                onConfirm={handleCheckinSubmit}
                processing={checkinForm.processing}
                reservationId={reservation.id}
            />
        </div>
    );
}