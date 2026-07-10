import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import React, { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

type MasterItem = {
    id: number;
    name: string;
};

type Props = {
    rooms: MasterItem[];
    plans: MasterItem[];
    success?: string;
};

export default function ReviewCreate({ rooms, plans }: Props) {
    const { flash } = usePage().props as any;
    const successMessage = flash?.success;

    const { data, setData, post, processing, errors } = useForm({
        room_id: '',
        plan_id: '',
        rating: 0,
        comment: '',
    });

    const [hoverRating, setHoverRating] = useState(0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/user/review');
    };

    return (
        <>
            <Head title="口コミ投稿" />

            <div className="w-full max-w-2xl mx-auto px-4 py-6 flex flex-col gap-6">
                
                {/* ⭕️ Aパターン：口コミ投稿が完了した場合の画面 */}
                {successMessage ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center animate-in fade-in zoom-in-95 duration-300">
                        <CheckCircle2 size={54} className="text-emerald-500 mb-4" />
                        <h1 className="text-xl font-bold text-slate-900 mb-2">口コミを投稿しました</h1>
                        <p className="text-sm text-slate-500 max-w-md leading-relaxed mb-8">{status}</p>
                        <div className="flex gap-3">
                            <Button asChild className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-6 h-10 rounded-lg shadow-sm">
                                <Link href="/user/dashboard">ダッシュボードへ</Link>
                            </Button>
                        </div>
                    </div>
                ) : (
                    /* ⭕️ Bパターン：通常時の入力フォーム画面 */
                    <>
                        {/* 戻る導線とタイトル */}
                        <div>
                            <Link href="/user/dashboard" className="inline-flex items-center text-xs text-slate-500 hover:text-slate-900 mb-2 transition-colors">
                                <ArrowLeft className="mr-1 h-3.5 w-3.5" /> ダッシュボードへ戻る
                            </Link>
                            <h1 className="text-xl font-bold tracking-tight text-slate-900">ご宿泊の口コミ・評価の投稿</h1>
                            <p className="text-xs text-slate-500 mt-1">今後のサービス向上のため、お客様のご感想をぜひお聞かせください。</p>
                        </div>

                        {/* フラットデザインのフォーム本体 */}
                        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-200">
                            
                            {/* お部屋選択（セレクトボックス） */}
                            <div className="grid gap-1.5">
                                <Label htmlFor="room_id" className="text-xs text-slate-700 font-medium">宿泊したお部屋</Label>
                                <select
                                    id="room_id"
                                    required
                                    value={data.room_id}
                                    onChange={e => setData('room_id', e.target.value)}
                                    className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-xs shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                >
                                    <option value="" disabled>お部屋を選択してください</option>
                                    {rooms.map(room => (
                                        <option key={room.id} value={room.id}>{room.name}</option>
                                    ))}
                                </select>
                                <InputError message={errors.room_id} />
                            </div>

                            {/* プラン選択（セレクトボックス） */}
                            <div className="grid gap-1.5">
                                <Label htmlFor="plan_id" className="text-xs text-slate-700 font-medium">利用した宿泊プラン</Label>
                                <select
                                    id="plan_id"
                                    required
                                    value={data.plan_id}
                                    onChange={e => setData('plan_id', e.target.value)}
                                    className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-1 text-xs shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                >
                                    <option value="" disabled>プランを選択してください</option>
                                    {plans.map(plan => (
                                        <option key={plan.id} value={plan.id}>{plan.name}</option>
                                    ))}
                                </select>
                                <InputError message={errors.plan_id} />
                            </div>

                            {/* 星評価（1〜5選択システム） */}
                            <div className="grid gap-1.5">
                                <Label className="text-xs text-slate-700 font-medium">総合評価（星マーク）</Label>
                                <div className="flex items-center gap-1.5 py-1">
                                    {[1, 2, 3, 4, 5].map((star) => {
                                        const isFilled = star <= (hoverRating || data.rating);
                                        
                                        return (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setData('rating', star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                className="text-2xl transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 rounded-md"
                                            >
                                                <span className={isFilled ? 'text-amber-400' : 'text-slate-200'}>★</span>
                                            </button>
                                        );
                                    })}
                                    {data.rating > 0 && (
                                        <span className="text-xs font-bold text-slate-500 ml-2">{data.rating} / 5 点</span>
                                    )}
                                </div>
                                <InputError message={errors.rating} />
                            </div>

                            {/* 口コミ内容入力（テキストエリア） */}
                            <div className="grid gap-1.5">
                                <Label htmlFor="comment" className="text-xs text-slate-700 font-medium">口コミ内容</Label>
                                <textarea
                                    id="comment"
                                    required
                                    rows={6}
                                    value={data.comment}
                                    onChange={e => setData('comment', e.target.value)}
                                    placeholder="客室の清潔さやスタッフの対応、お食事の感想などをご自由にご記入ください（10文字以上）。"
                                    className="w-full text-xs border border-slate-200 rounded-lg p-3 bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                                />
                                <InputError message={errors.comment} />
                            </div>

                            {/* 登録・アクションボタン */}
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <Link
                                    href="/mypage"
                                    className="px-5 py-2 border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                                >
                                    キャンセル
                                </Link>
                                <Button
                                    type="submit"
                                    disabled={processing || data.rating === 0}
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-6 py-2 rounded-lg shadow-sm transition-colors disabled:opacity-50"
                                >
                                    {processing ? '送信処理中...' : 'この内容で口コミを投稿する'}
                                </Button>
                            </div>

                        </form>
                    </>
                )}
            </div>
        </>
    );
}