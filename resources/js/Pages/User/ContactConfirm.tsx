import { Head, useForm } from '@inertiajs/react';
import React from 'react';

type Props = {
    inputs: {
        title: string;
        email: string;
        content: string;
    };
}

export default function ContactsConfirm({ inputs }: Props) {
    // 💡 確定保存用。inputsの中身をそのまま送信データにのせる
    const { post: postStore, processing: processingStore } = useForm({
        title: inputs.title,
        email: inputs.email,
        content: inputs.content,
    });

    // 2. 入力画面に戻る用のフォーム
    const { post: postBack, processing: processingBack } = useForm({
        title: inputs.title,
        email: inputs.email,
        content: inputs.content,
    });

    const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
        // 💡 戻るボタン：入力していた値を保持したまま入力フォーム画面へリダイレクト
        e.preventDefault();
        postBack('/user/contact');
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        postStore('/user/contact/store');
    };

    return (
        <div className="min-h-screen bg-neutral-50 text-neutral-800 antialiased font-sans py-12 px-4 sm:px-6 lg:px-8">
            <Head title="お問い合わせ内容の確認" />
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">内容の確認</h1>
                    <p className="mt-2 text-sm text-neutral-500">以下の内容でお間違いなければ、「送信する」ボタンを押してください。</p>
                </div>

                <div className="border-b border-neutral-100 pb-4">
                    <span className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">メールアドレス</span>
                    <p className="text-base text-neutral-900 font-medium">{inputs.email}</p>
                </div>

                <div className="border-b border-neutral-100 pb-4">
                    <span className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">お問い合わせ件名</span>
                    <p className="text-base text-neutral-900 font-medium">{inputs.title}</p>
                </div>

                <div className="border-b border-neutral-100 pb-4">
                    <span className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">お問い合わせ内容</span>
                    <p className="text-base text-neutral-900 whitespace-pre-wrap font-medium">{inputs.content}</p>
                </div>

                <form onSubmit={handleSubmit} className="flex gap-4 pt-4">
                    <button
                        type="button"
                        onClick={handleBack}
                        className="flex-1 py-3 border border-neutral-200 rounded-xl text-sm font-bold text-neutral-600 hover:bg-neutral-50 transition-colors"
                    >
                        修正する
                    </button>
                    <button
                        type="submit"
                        disabled={processingStore || processingBack}
                        className="flex-1 py-3 bg-indigo-600 hover:bg-imdigo-700 text-white rounded-xl text-sm font-bold shadow-md transition-colors disabled:opacity-50"
                    >
                    {processingStore ? '送信処理中...' : 'この内容で送信する'}
                    </button>
                </form>
            </div>
        </div>
    );
}
