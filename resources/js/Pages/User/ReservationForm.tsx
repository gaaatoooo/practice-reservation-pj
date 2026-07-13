/* global route */
import { Head, useForm } from '@inertiajs/react';
import { format, parseISO, addDays, differenceInDays } from 'date-fns';
import { ja } from 'date-fns/locale';
import { useState, useEffect } from 'react';
import { DayPicker, type DateRange } from 'react-day-picker';
import ReservationCalendar from '@/components/layout/ReservationCalendar';
import 'react-day-picker/dist/style.css';

type RoomItem = {
    id: number;
    name: string;
    description: string | null;
    price: number;
};

type PlanItem = {
    id: number;
    name: string;
    description: string | null;
    planPrice: number;
};

type UserInfo = {
    name: string;
    email: string;
    tel: string | null;
    zip: string | null;
    address: string | null;
};

// ⭕️ 戻りデータ用の専用型定義
type InputsInfo = {
    plan_id?: string;
    reservation_end_date?: string;
    number?: number;
    is_other_guest?: boolean;
    guest_name?: string;
    guest_email?: string;
    guest_tel?: string;
    guest_zip?: string;
    guest_address?: string;
    guest_birthday?: string;
};

type Props = {
    date: string;
    roomId: number;
    roomName: string;
    roomPrice: number;
    rooms: RoomItem[];
    plans: PlanItem[];
    user: UserInfo;
    inputs: InputsInfo; // ⭕️ 追記
};

export default function ReservationForm({ date, roomId, roomName, roomPrice, rooms, plans, user, inputs }: Props) {
    const initialStart = parseISO(date);
    const initialEnd = inputs?.reservation_end_date ? parseISO(inputs.reservation_end_date) : addDays(initialStart, 1);
    
    const [range, setRange] = useState<DateRange | undefined>({
        from: initialStart,
        to: initialEnd,
    });

    // ⭕️ リアルタイムに変動する合計金額を保持する状態
    const [totalPrice, setTotalPrice] = useState<number>(0);

    // ⭕️ フォームの初期値設定を「inputs」の箱から厳密に読み込む形に修正
    const { data, setData, post, processing, errors } = useForm({
        room_id: roomId,
        plan_id: inputs?.plan_id ? inputs.plan_id.toString() : (plans && plans.length > 0 ? plans[0].id.toString() : ''),
        reservation_start_date: date,
        reservation_end_date: inputs?.reservation_end_date || format(initialEnd, 'yyyy-MM-dd'),
        number: inputs?.number ? Number(inputs.number) : 1,
        
        // ⭕️ inputs から真偽値を正確に受け取るため、チェックボックスが外れるバグが直ります
        is_other_guest: inputs?.is_other_guest || false,
        guest_name: inputs?.guest_name || '',
        guest_email: inputs?.guest_email || '', // ⭕️ 追加
        guest_tel: inputs?.guest_tel || '',
        guest_zip: inputs?.guest_zip || '',
        guest_address: inputs?.guest_address || '',
        guest_birthday: inputs?.guest_birthday || '',
    });

    // ⭕️ 1. 選択されたプランを安全に逆引き（型を確実にあわせる）
    const selectedPlan = plans?.find(p => Number(p.id) === Number(data.plan_id));

    // ⭕️ 2. 選択された部屋を安全に逆引き
    const selectedRoom = rooms?.find(r => Number(r.id) === Number(data.room_id));

    // ⭕️ 3. 三項演算子と Number() を使い、確実に「数値（number）」を取り出す。型崩れ時は 0 に逃がす
    const planPrice = selectedPlan ? Number((selectedPlan as any).price) : 0;
    const roomUnitPrice = selectedRoom ? Number(selectedRoom.price) : 0;

    // ⭕️ 4. 1泊単価の合算（どちらも確実に数値型なので、100% NaN になりません）
    const currentPrice = (isNaN(roomUnitPrice) ? 0 : roomUnitPrice) + (isNaN(planPrice) ? 0 : planPrice);

    useEffect(() => {
        if (range?.from) {
            setData('reservation_start_date', format(range.from, 'yyyy-MM-dd'));
        }

        if (range?.to) {
            setData('reservation_end_date', format(range.to, 'yyyy-MM-dd'));
        }

    }, [range]);

    useEffect(() => {
        let nights = 1;

        if (range?.from && range?.to) {
            const calculatedNights = differenceInDays(range.to, range.from);
        
            if (calculatedNights > 0) {
                nights = calculatedNights;
            }
        }

        const guestCount = Number(data.number) || 1;
        const calculatedTotal = ((roomUnitPrice + planPrice) * guestCount) * nights;

        setTotalPrice(calculatedTotal);
    }, [data.room_id, data.plan_id, data.number, range, roomUnitPrice, planPrice]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/user/reservation/confirm');
    };

    return (
        <>
            <Head title="宿泊予約手続き" />
            <div className="p-6 max-w-5xl mx-auto flex flex-col gap-6">
                <div className="border-b pb-4">
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">宿泊予約手続き</h1>
                    <p className="text-sm text-neutral-400 mt-1">ご予約内容とお客様情報を確認・入力してください。</p>
                </div>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        
                        {/* 1. カレンダー範囲選択 */}
                        <ReservationCalendar 
                            range={range}
                            setRange={setRange}
                            startDateStr={data.reservation_start_date}
                            endDateStr={data.reservation_end_date}
                        />

                        {/* 2. 予約者情報 */}
                        <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm flex flex-col gap-4">
                            <h2 className="text-base font-bold text-neutral-800 dark:text-neutral-200 border-l-4 border-blue-600 pl-2">👤 予約者・宿泊者情報</h2>
                            <div className="text-sm text-neutral-700 dark:text-neutral-300 bg-blue-50/50 dark:bg-blue-950/10 p-4 rounded-xl">
                                {/* ⭕️ 本人の情報は user.name 固定なので、上書きバグが完全に直ります */}
                                <p><strong>ログイン中のユーザー:</strong> {user.name} 様 ({user.email})</p>
                            </div>

                            <label className="flex items-center gap-2 mt-2 cursor-pointer p-2 hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-lg self-start">
                                <input type="checkbox" checked={data.is_other_guest} onChange={e => setData('is_other_guest', e.target.checked)} className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500 w-4 h-4" />
                                <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">ログインユーザー以外の予約者情報を入力する</span>
                            </label>

                            {/* 別予約者用フォーム */}
                            {data.is_other_guest && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 border-t pt-4 border-neutral-100 dark:border-neutral-700">
                                    <div className="sm:col-span-2"><p className="text-xs text-orange-600 font-medium">※ご宿泊される方の情報を入力してください。</p></div>
                                    <div>
                                        <label className="block text-xs font-semibold text-neutral-500 mb-1">お名前（必須）</label>
                                        <input type="text" required={data.is_other_guest} value={data.guest_name} onChange={e => setData('guest_name', e.target.value)} className="w-full border border-neutral-200 dark:border-neutral-700 rounded-lg p-2.5 bg-white dark:bg-neutral-900 text-sm" />
                                    </div>
                                    {/* ⭕️ 新設：別予約者用のメールアドレス入力ボックス */}
                                    <div>
                                        <label className="block text-xs font-semibold text-neutral-500 mb-1">メールアドレス（必須）</label>
                                        <input type="email" required={data.is_other_guest} value={data.guest_email} onChange={e => setData('guest_email', e.target.value)} className="w-full border border-neutral-200 dark:border-neutral-700 rounded-lg p-2.5 bg-white dark:bg-neutral-900 text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-neutral-500 mb-1">電話番号（必須）</label>
                                        <input type="tel" required={data.is_other_guest} placeholder="09000000000" value={data.guest_tel} onChange={e => setData('guest_tel', e.target.value)} className="w-full border border-neutral-200 dark:border-neutral-700 rounded-lg p-2.5 bg-white dark:bg-neutral-900 text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-neutral-500 mb-1">郵便番号</label>
                                        <input type="text" placeholder="1000000" value={data.guest_zip} onChange={e => setData('guest_zip', e.target.value)} className="w-full border border-neutral-200 dark:border-neutral-700 rounded-lg p-2.5 bg-white dark:bg-neutral-900 text-sm" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-neutral-500 mb-1">生年月日</label>
                                        <input type="date" value={data.guest_birthday} onChange={e => setData('guest_birthday', e.target.value)} className="w-full border border-neutral-200 dark:border-neutral-700 rounded-lg p-2.5 bg-white dark:bg-neutral-900 text-sm" />
                                    </div>
                                    <div className="sm:col-span-2">
                                        <label className="block text-xs font-semibold text-neutral-500 mb-1">ご住所</label>
                                        <input type="text" placeholder="東京都千代田区..." value={data.guest_address} onChange={e => setData('guest_address', e.target.value)} className="w-full border border-neutral-200 dark:border-neutral-700 rounded-lg p-2.5 bg-white dark:bg-neutral-900 text-sm" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* 3. 宿泊プランの選択 */}
                        <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm flex flex-col gap-4">
                            <h2 className="text-base font-bold text-neutral-800 dark:text-neutral-200 border-l-4 border-blue-600 pl-2">
                                🎁 宿泊プランの選択
                            </h2>
                            <div className="w-full">
                                <select 
                                    value={data.plan_id} 
                                    onChange={e => setData('plan_id', e.target.value)} 
                                    className="w-full border border-neutral-200 dark:border-neutral-700 rounded-lg p-2.5 bg-white dark:bg-neutral-900 text-sm text-neutral-800 dark:text-neutral-200"
                                >
                                    {plans.map(plan => (
                                        <option key={plan.id} value={plan.id}>
                                            {plan.name}
                                        </option>
                                    ))}
                                </select>
                                
                                {selectedPlan?.description && (
                                    <p className="mt-3 text-xs text-neutral-400 p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg border border-neutral-100 dark:border-neutral-800">
                                        💡 {selectedPlan.description}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* 4. 宿泊人数 */}
                        <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm flex flex-col gap-4">
                            <h2 className="text-base font-bold text-neutral-800 dark:text-neutral-200 border-l-4 border-blue-600 pl-2">
                                👥 宿泊人数
                            </h2>
                            <div className="w-1/3">
                                <select 
                                    value={data.number} 
                                    onChange={e => setData('number', parseInt(e.target.value))} 
                                    className="w-full border border-neutral-200 dark:border-neutral-700 rounded-lg p-2.5 bg-white dark:bg-neutral-900 text-sm text-neutral-800 dark:text-neutral-200"
                                >
                                    {[1, 2, 3, 4].map(num => (
                                        <option key={num} value={num}>
                                            {num}名
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* 右側：予約内容サマリー */}
                    <div className="lg:col-span-1">
                        <div className="p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-200/60 dark:border-neutral-700/60 flex flex-col gap-4 sticky top-6 shadow-sm">
                            <h3 className="font-bold text-xs text-neutral-400 tracking-wider uppercase">
                                選択中の内容
                            </h3>
                            
                            <div className="grid gap-2">
                                <label htmlFor="room_id" className="text-sm font-bold text-gray-700">お部屋タイプ</label>
                                <select
                                    id="room_id"
                                    name="room_id"
                                    value={data.room_id || ''}
                                    // ⭕️ 修正：Numberキャスト
                                    onChange={e => setData('room_id', Number(e.target.value))}
                                    required
                                    className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    {/* 最初のプレースホルダー（選択必須とするためvalueは空文字） */}
                                    <option value="">-- お部屋を選択してください --</option>
                                    {rooms.map((room) => (
                                        <option key={room.id} value={room.id}>
                                            {room.name}
                                        </option>
                                    ))}
                                </select>

                                {/* ⭕️ 追加：選択されたお部屋の説明文をリアルタイムに表示するエリア */}
                                {selectedRoom && selectedRoom.description && (
                                    <div className="mt-2 p-3 bg-neutral-50 dark:bg-neutral-800/40 rounded-lg border border-neutral-100 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed whitespace-pre-wrap animate-fade-in">
                                        <strong className="text-neutral-700 dark:text-neutral-300 block mb-1">【客室のご案内】</strong>
                                        {selectedRoom.description}
                                    </div>
                                )}

                                {/* ⭕️ 追加：お部屋未選択時にInertiaのバックエンドエラーを表示するガード */}
                                {errors.room_id && (
                                    <div className="text-sm text-red-600 font-medium mt-1">
                                        {errors.room_id}
                                    </div>
                                )}
                            </div>
                            
                            <div className="flex flex-col gap-1 border-b pb-3">
                                <span className="text-xs text-neutral-400">選択中のプラン</span>
                                <span className="font-bold text-blue-600 dark:text-blue-400">
                                    {selectedPlan ? selectedPlan.name : ''}
                                </span>
                            </div>
                            
                            <div className="flex flex-col gap-1 border-b pb-3">
                                <span className="text-xs text-neutral-400">チェックイン日</span>
                                <span className="font-bold text-neutral-900 dark:text-neutral-100 font-mono">
                                    {data.reservation_start_date.replace(/-/g, '/') || '未選択'}
                                </span>
                            </div>
                            
                            <div className="flex flex-col gap-1 border-b pb-3">
                                <span className="text-xs text-neutral-400">チェックアウト日</span>
                                <span className="font-bold text-neutral-900 dark:text-neutral-100 font-mono">
                                    {data.reservation_end_date.replace(/-/g, '/') || '未選択'}
                                </span>
                            </div>
                            
                            <div className="flex justify-between items-center pt-2">
                                <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">部屋基本料金</span>
                                <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100 font-mono">
                                    <div>1泊あたりの料金: ¥{currentPrice.toLocaleString()}</div>
                                    <span className="text-xs font-normal text-neutral-400">/ 泊</span>
                                </span>
                            </div>

                            <div className="flex flex-col gap-2 mt-2">
                                <button
                                    type="submit"
                                    disabled={processing || !data.reservation_end_date}
                                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-300 text-white font-semibold text-sm py-3.5 rounded-xl shadow-md transition-colors"
                                >
                                    予約内容を確認する
                                </button>
                                
                                {Object.keys(errors).length > 0 && (
                                    <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 font-medium">
                                        ⚠️ 入力不備：
                                        <ul className="list-disc pl-4 mt-1">
                                            {Object.entries(errors).map(([key, val]) => (
                                                <li key={key}>{val}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
}

