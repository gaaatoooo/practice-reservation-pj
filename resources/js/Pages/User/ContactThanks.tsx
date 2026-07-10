import { Head, Link } from '@inertiajs/react';

export default function ReservationThanks() {
    return (
        <>
            <Head title="予約完了" />
            <div className="p-6 max-w-xl mx-auto text-center py-20 flex flex-col items-center gap-6">
                {/* チェックマークのアイコン風丸サークル */}
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 text-3xl font-bold animate-bounce">
                    ✓
                </div>

                <div className="flex flex-col gap-2">
                    <h1 className="text-2xl font-extrabold text-neutral-900 mb-2">送信が完了いたしました</h1>
                    <p className="text-sm text-neutral-500 mb-6 leading-relaxed">
                        お問い合わせを受け付けいたしました。<br />
                        入力いただいたメールアドレス宛に確認メールを送信しておりますので、ご確認ください。
                    </p>
                </div>

                <div className="border-t w-full my-2 pt-6">
                    {/* ダッシュボード画面に戻るリンクボタン */}
                    <Link
                        href='/user/dashboard'
                        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-md transition-colors"
                    >
                        トップページへ戻る
                    </Link>
                </div>
            </div>
        </>
    );
}
