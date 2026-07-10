import { useForm } from '@inertiajs/react';
import { X, Send, CheckCircle2, ArrowLeft, Eye } from 'lucide-react';
import React, { useState } from 'react';

interface ContactItem {
    id: number;
    type: number;
    title: string;
    email: string;
    content: string;
    created_at: string;
    target_id: number;
    target_title: string;
    target_content: string;
}

interface ContactDetailModalProps {
    contact: ContactItem;
    onClose: () => void;
}

// ⭕️ モーダルのフェーズを管理する型定義
type Step = 'input' | 'confirm' | 'complete';

export default function ContactDetailModal({ contact, onClose }: ContactDetailModalProps) {
    // ⭕️ 現在のステップを管理するステート（初期値は入力画面）
    const [step, setStep] = useState<Step>('input');
    
    // 返信フォーム用の Inertia useForm
    const { data, setData, post, processing, reset, errors } = useForm({
        reply_content: '',
    });

    // ⭕️ 入力画面から確認画面へ進む処理
    const handleGoToConfirm = (e: React.FormEvent) => {
        e.preventDefault();
        
        // バリデーション：空文字のまま進むのをフロントで簡易ブロック
        if (!data.reply_content.trim()) {
            return;
        }

        setStep('confirm');
    };

    // ⭕️ 確認画面から実際にサーバーへPOST送信する処理
    const handleSendReply = () => {
        post(`/admin/contacts/${contact.id}/reply`, {
            onSuccess: () => {
                reset();
                setStep('complete'); // 送信成功時に完了画面へ遷移
            }
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white border border-slate-200 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                
                {/* モーダルヘッダー */}
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                    <h3 className="text-md font-bold text-slate-900">
                        {step === 'input' && `お問合せ詳細（ID: ${contact.id}）`}
                        {step === 'confirm' && `返信内容の確認（ID: ${contact.id}）`}
                        {step === 'complete' && `送信完了`}
                    </h3>
                    {/* 完了画面以外では右上の×ボタンを有効化 */}
                    {step !== 'complete' && (
                        <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-colors">
                            <X size={20} />
                        </button>
                    )}
                </div>

                {/* モーダルボディ（スクロール領域） */}
                <div className="p-6 overflow-y-auto space-y-6 flex-1コンテ">
                    
                    {contact.type == 2 && contact.target_id && (
                        <>
                            <div>
                                <span className="block text-xs font-bold text-slate-400 uppercase mb-1 text-left">返信対象のお問合せ件名</span>
                                <p className="text-sm font-bold text-slate-900 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 text-left">{contact.target_title}</p>
                            </div>

                            <div>
                                <span className="block text-xs font-bold text-slate-400 uppercase mb-1 text-left">返信対象のお問合せ内容</span>
                                <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-200/60 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto text-left">
                                    {contact.target_content}
                                </div>
                            </div>
                        </>
                    )}

                    {/* ＝ 1. 【入力画面】または【確認画面】の時に表示するお問合せ原文パーツ ＝ */}
                    {step !== 'complete' && (
                        <>
                            <div>
                                <span className="block text-xs font-bold text-slate-400 uppercase mb-1 text-left">送信者メールアドレス</span>
                                <p className="text-sm font-semibold text-slate-900 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 select-all text-left">{contact.email}</p>
                            </div>

                            <div>
                                <span className="block text-xs font-bold text-slate-400 uppercase mb-1 text-left">お問合せ件名</span>
                                <p className="text-sm font-bold text-slate-900 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60 text-left">{contact.title}</p>
                            </div>

                            <div>
                                <span className="block text-xs font-bold text-slate-400 uppercase mb-1 text-left">お問合せ内容</span>
                                <div className="text-sm text-slate-700 bg-slate-50 p-4 rounded-lg border border-slate-200/60 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto text-left">
                                    {contact.content}
                                </div>
                            </div>
                        </>
                    )}

                    {/* 💡 ユーザーからの問い合わせ（type === 1）の場合のみ各種返信フェーズを稼働 */}
                    {contact.type === 1 && (
                        <div className="border-t border-slate-100 pt-4">
                            
                            {/* ⭕️ フェーズA：【入力画面】 */}
                            {step === 'input' && (
                                <div className="animate-in fade-in duration-200">
                                    <span className="block text-xs font-bold text-indigo-500 uppercase mb-1.5 text-left">このお問合せに返信する</span>
                                    <form onSubmit={handleGoToConfirm} className="space-y-3">
                                        <textarea
                                            value={data.reply_content}
                                            onChange={(e) => setData('reply_content', e.target.value)}
                                            placeholder="ここに返信内容を入力してください。"
                                            className={`w-full text-sm border rounded-lg p-3 bg-white h-40 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${
                                                errors.reply_content ? 'border-rose-400' : 'border-slate-300'
                                            }`}
                                        />
                                        {errors.reply_content && <p className="text-xs text-rose-600 font-medium mt-0.5">{errors.reply_content}</p>}
                                        
                                        <div className="flex justify-end gap-2">
                                            <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50">キャンセル</button>
                                            <button
                                                type="submit"
                                                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-bold shadow-sm flex items-center gap-1"
                                            >
                                                <Eye size={14} /> 確認画面へ進む
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {/* ⭕️ フェーズB：【確認画面】 */}
                            {step === 'confirm' && (
                                <div className="animate-in fade-in duration-200 space-y-4">
                                    <div>
                                        <span className="block text-xs font-bold text-amber-500 uppercase mb-1.5 text-left">以下の内容でお客様へメール返信されます</span>
                                        <div className="text-sm text-slate-800 bg-amber-50/50 p-4 rounded-lg border border-amber-200/60 whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto text-left font-medium">
                                            {data.reply_content}
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-end gap-2 pt-2">
                                        <button 
                                            type="button" 
                                            onClick={() => setStep('input')} 
                                            disabled={processing}
                                            className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-sm font-medium hover:bg-slate-50 flex items-center gap-1 disabled:opacity-50"
                                        >
                                            <ArrowLeft size={14} /> 入力に戻る
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleSendReply}
                                            disabled={processing}
                                            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-bold shadow-sm flex items-center gap-1 disabled:opacity-50"
                                        >
                                            <Send size={14} /> {processing ? '送信中...' : 'この内容で確定・送信する'}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* ⭕️ フェーズC：【返信完了画面】 */}
                            {step === 'complete' && (
                                <div className="flex flex-col items-center justify-center py-10 text-center animate-in fade-in zoom-in-95 duration-300">
                                    <CheckCircle2 size={54} className="text-emerald-500 mb-3" />
                                    <h4 className="text-base font-bold text-slate-900 mb-1">返信メールを送信しました</h4>
                                    <p className="text-xs text-slate-500">お問合せへの返信対応が正常に記録されました。</p>
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        className="mt-6 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold shadow-md transition-colors"
                                    >
                                        閉じる
                                    </button>
                                </div>
                            )}

                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
