import { Head, useForm } from '@inertiajs/react';

type Props = {
    inputs: {
        room_id: number;
        plan_id: number;
        reservation_start_date: string;
        reservation_end_date: string;
        number: number;
        is_other_guest: boolean;
        guest_name?: string;
        guest_email?: string;
        guest_tel?: string;
        guest_zip?: string;
        guest_address?: string;
        guest_birthday?: string;
    };
    roomName: string;
    planName: string;
    roomPrice: number; // ⭕️ 部屋の基本料金の型定義
    planPrice: number;
    nights: number;
    totalPrice: number;
    guestName: string;
    guestEmail: string;
    guestTel: string;
    guestZip?: string;
    guestAddress?: string;
    guestBirthday?: string;
};

// ⭕️ 修正：引数（{ } の中）に「roomPrice」をしっかりと受け取るように追記しました！
export default function ReservationConfirm({ inputs, roomName, planName, roomPrice, planPrice, nights, totalPrice, guestName, guestEmail, guestTel, guestZip, guestAddress, guestBirthday }: Props) {
    
    // 1. 確定保存用のフォーム
    const { post: postStore, processing: processingStore } = useForm({
        room_id: inputs.room_id,
        plan_id: inputs.plan_id,
        reservation_start_date: inputs.reservation_start_date,
        reservation_end_date: inputs.reservation_end_date,
        number: inputs.number,
        is_other_guest: inputs.is_other_guest,
        guest_name: inputs.guest_name,
        guest_email: inputs.guest_email,
        guest_tel: inputs.guest_tel,
        guest_zip: inputs.guest_zip,
        guest_address: inputs.guest_address,
        guest_birthday: inputs.guest_birthday,
    });

    // 2. 入力画面に戻る用のフォーム
    const { post: postBack, processing: processingBack } = useForm({
        date: inputs.reservation_start_date,
        room_id: inputs.room_id,
        plan_id: inputs.plan_id,
        reservation_end_date: inputs.reservation_end_date,
        number: inputs.number,
        is_other_guest: inputs.is_other_guest,
        guest_name: guestName,
        guest_email: guestEmail,
        guest_tel: guestTel,
        guest_zip: guestZip,
        guest_address: guestAddress,
        guest_birthday: guestBirthday,
    });

    // 確定ボタン押下時
    const handleConfirm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        postStore('/user/reservation/store');
    };

    // 戻るボタン押下時
    const handleBackToForm = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        postBack('/user/reservation');
    };

    // 1泊あたりの人数分の小計を安全に計算
    const pricePerNight = nights > 0 ? (roomPrice + planPrice) * Number(inputs.number) / nights : (roomPrice + planPrice) * Number(inputs.number);

    return (
        <>
            <Head title="予約内容の確認" />
            <div className="p-6 max-w-3xl mx-auto flex flex-col gap-6">
                <div className="border-b pb-4">
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">ご予約内容の確認</h1>
                    <p className="text-sm text-neutral-400 mt-1">内容に間違いがないかご確認ください。</p>
                </div>

                <form onSubmit={handleConfirm} className="flex flex-col gap-6">
                    {/* ご宿泊内容 */}
                    <div className="bg-neutral-50 dark:bg-neutral-800/40 p-6 rounded-2xl border border-neutral-200/60 dark:border-neutral-700/60 flex flex-col gap-4">
                        <h2 className="text-sm font-bold text-neutral-400 tracking-wider uppercase">🏨 ご宿泊内容</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                            <p><span className="text-neutral-400">お部屋:</span> <strong className="text-neutral-900 dark:text-neutral-100">{roomName}</strong></p>
                            <p><span className="text-neutral-400">宿泊プラン:</span> <strong className="text-neutral-900 dark:text-neutral-100">{planName}</strong></p>
                            <p><span className="text-neutral-400">期間:</span> <strong className="text-neutral-900 dark:text-neutral-100 font-mono">{inputs.reservation_start_date.replace(/-/g, '/')} 〜 {inputs.reservation_end_date.replace(/-/g, '/')}</strong>（{nights}泊）</p>
                            <p><span className="text-neutral-400">宿泊人数:</span> <strong className="text-neutral-900 dark:text-neutral-100">{inputs.number}名</strong></p>
                        </div>
                    </div>

                    {/* ご予約者様情報 */}
                    <div className="bg-neutral-50 dark:bg-neutral-800/40 p-6 rounded-2xl border border-neutral-200/60 dark:border-neutral-700/60 flex flex-col gap-4">
                        <h2 className="text-sm font-bold text-neutral-400 tracking-wider uppercase">👤 ご予約者様情報</h2>
                        {!inputs.is_other_guest ? (
                            <div className="text-sm text-green-600 dark:text-green-400 font-semibold p-2 bg-green-50/50 dark:bg-green-950/10 rounded-xl">
                                ✓ ログインユーザーご本人様によるご宿泊
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div className="sm:col-span-2 text-xs font-bold text-orange-500">※代理予約（ログインユーザーとは別のご宿泊者様情報）</div>
                                <p><span className="text-neutral-400">お名前:</span> <strong className="text-neutral-900 dark:text-neutral-100">{guestName}</strong></p>
                                <p><span className="text-neutral-400">メールアドレス:</span> <strong className="text-neutral-900 dark:text-neutral-100">{guestEmail}</strong></p>
                                <p><span className="text-neutral-400">電話番号:</span> <strong className="text-neutral-900 dark:text-neutral-100 font-mono">{guestTel}</strong></p>
                                <p><span className="text-neutral-400">郵便番号:</span> <strong className="text-neutral-900 dark:text-neutral-100 font-mono">{guestZip || '未入力'}</strong></p>
                                <p><span className="text-neutral-400">生年月日:</span> <strong className="text-neutral-900 dark:text-neutral-100 font-mono">{guestBirthday || '未入力'}</strong></p>
                                <div className="sm:col-span-2">
                                    <p><span className="text-neutral-400">住所:</span> <strong className="text-neutral-900 dark:text-neutral-100">{guestAddress || '未入力'}</strong></p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ⭕️ 1泊ずつの料金内訳明細エリア */}
                    <div className="p-6 bg-neutral-50 dark:bg-neutral-800/30 rounded-2xl border border-neutral-200/60 dark:border-neutral-700/60 flex flex-col gap-3 text-sm">
                        <h3 className="font-bold text-xs text-neutral-400 tracking-wider uppercase mb-1">
                            📄 料金内訳明細
                        </h3>
                        
                        {/* 1泊あたりの基本料金 */}
                        <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-400">
                            <span>お部屋基本料金（1名様あたり / 泊）</span>
                            <span className="font-medium font-mono">¥{roomPrice?.toLocaleString()}</span>
                        </div>
                        
                        {/* 宿泊人数 */}
                        <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-400">
                            <span>ご宿泊人数</span>
                            <span className="font-medium">{inputs.number} 名</span>
                        </div>

                        {/* ⭕️ 追記：選択されたプラン料金の明細行（プランが選ばれている場合のみ表示） */}
                        {planPrice >= 0 && (
                            <div className="flex justify-between items-center text-neutral-600 dark:text-neutral-400 animate-in fade-in duration-150">
                                <span>選択プラン料金（1室あたり / 泊）</span>
                                <span className="font-medium font-mono text-indigo-600">
                                    + ¥{planPrice.toLocaleString()}
                                </span>
                            </div>
                        )}

                        {/* 1泊あたりの小計 */}
                        <div className="flex justify-between items-center pb-2 border-b border-dashed border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 font-semibold">
                            <span>1泊あたりの小計</span>
                            <span className="font-mono">
                                ¥{pricePerNight.toLocaleString()} 
                                <span className="text-xs font-normal text-neutral-400 ml-1">
                                    （¥{roomPrice?.toLocaleString()} × {inputs.number}名）
                                </span>
                            </span>
                        </div>

                        {/* ご宿泊数 */}
                        <div className="flex justify-between items-center pt-1 text-neutral-800 dark:text-neutral-200 font-semibold">
                            <span>ご宿泊数</span>
                            <span className="text-blue-600 dark:text-blue-400 font-bold">{nights} 泊</span>
                        </div>
                    </div>

                    {/* 合計金額 */}
                    <div className="p-6 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl border border-blue-100 dark:border-blue-900/40 flex justify-between items-center">
                        <span className="text-base font-bold text-blue-800 dark:text-blue-400">総合計金額（税込）</span>
                        <span className="text-3xl font-black text-blue-600 dark:text-blue-400 font-mono">¥{pricePerNight.toLocaleString()}</span>
                    </div>

                    {/* 操作ボタン */}
                    <div className="flex flex-col sm:flex-row gap-4 mt-2">
                        <button
                            type="button"
                            onClick={handleBackToForm}
                            disabled={processingBack || processingStore}
                            className="w-full sm:w-1/3 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold py-3.5 rounded-xl text-sm transition-colors text-center"
                        >
                            修正する（入力画面へ戻る）
                        </button>
                        {/* 確定ボタン */}
                        <button
                            type="submit"
                            disabled={processingStore || processingBack}
                            className="w-full sm:w-2/3 bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-300 text-white font-semibold py-3.5 rounded-xl text-sm shadow-md transition-colors text-center flex items-center justify-center"
                        >
                            {processingStore ? (
                                <span className="flex items-center gap-2">
                                    {/* 処理中のローディング風アニメーション */}
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://w3.org" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    処理中...
                                </span>
                            ) : (
                                'この内容で予約を確定する'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
