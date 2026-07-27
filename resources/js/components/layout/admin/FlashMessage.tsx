import { usePage } from '@inertiajs/react';
import React, { useEffect, useState } from 'react';

interface PageProps {
    flash: {
        success: string | null;
        error: string | null;
    };
    [key: string]: any;
}

export default function FlashMessage() {
    // 💡 page 全体を取得して、リクエストごとの更新を検知できるようにする
    const page = usePage<PageProps>();
    const { flash } = page.props;
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (flash.success || flash.error) {
            // 💡 連続クリック対策：一度非表示にしてから、次のフレームで再表示する
            setIsVisible(false);
            
            const showTimeout = setTimeout(() => {
                setIsVisible(true);
            }, 10);

            // 5秒後に自動で非表示にするタイマー
            const hideTimer = setTimeout(() => {
                setIsVisible(false);
            }, 5000);

            return () => {
                clearTimeout(showTimeout);
                clearTimeout(hideTimer);
            };
        }
    }, [flash, page.props]); // 💡 page.props も監視対象に加えることで、連続した更新を検知

    if (!isVisible) {
        return null;
    }

    return (
        <div className="w-full mb-4 space-y-2">
            {flash.success && (
                <div className="p-4 text-sm text-green-800 rounded-lg bg-green-50 border border-green-200 shadow-sm transition-all" role="alert">
                    <span className="font-medium"></span> {flash.success}
                </div>
            )}
            {flash.error && (
                <div className="p-4 text-sm text-red-800 rounded-lg bg-red-50 border border-red-200 shadow-sm transition-all" role="alert">
                    <span className="font-medium">エラー:</span> {flash.error}
                </div>
            )}
        </div>
    );
}