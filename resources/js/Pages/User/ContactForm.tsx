import { Head, useForm } from '@inertiajs/react';
import React from 'react';

interface Props {
    inputs: {
        title: string;
        email: string;
        content: string;
    };
}

export default function ContactForm({ inputs }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        title: inputs?.title || '',
        email: inputs?.email || '',
        content: inputs?.content || '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // 💡 確認画面のエンドポイントへPOST送信
        post('/user/contact/confirm');
    };

    return (
        <div className="min-h-screen bg-white text-neutral-800 antialiased font-sans py-12 px-4 sm:px-6 lg:px-8">
            <Head title="お問い合わせ入力" />
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">お問い合わせ入力</h1>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-neutral-700 mb-1.5">メールアドレス</label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            className={`w-full text-sm border rounded-lg focus:border-blue-500 bg-white py-2.5 px-3.5 ${
                                errors.email ? 'border-rose-400 focus:border-rose-500' : 'border-neutral-300'
                            }`}
                        />
                        {errors.email && <p className="text-xs text-rose-600 font-medium mt-1">{errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-neutral-700 mb-1.5">お問い合わせ件名</label>
                        <input
                            type="text"
                            value={data.title}
                            onChange={(e) => setData('title', e.target.value)}
                            className={`w-full text-sm border rounded-lg focus:border-blue-500 bg-white py-2.5 px-3.5 ${
                                errors.title ? 'border-rose-400 focus:border-rose-500' : 'border-neutral-300'
                            }`}
                        />
                        {errors.title && <p className="text-xs text-rose-600 font-medium mt-1">{errors.title}</p>}
                    </div>

                    <div>
                    <label className="block text-sm font-bold text-neutral-700 mb-1.5">お問い合わせ内容（本文）</label>
                        <textarea
                            value={data.content}
                            onChange={(e) => setData('content', e.target.value)}
                            className={`w-full text-sm border rounded-lg focus:border-blue-500 bg-white h-48 p-3.5 ${
                                errors.content ? 'border-rose-400 focus:border-rose-500' : 'border-neutral-300'
                            }`}
                        />
                        {errors.content && <p className="text-xs text-rose-600 font-medium mt-1">{errors.content}</p>}
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-3 bg-indigo-600 hover:bg-indogo-700 text-white rounded-xl text-sm font-bold shadow-md transition-colors disabled:opacity-50"
                        >
                            入力内容を確認する
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
