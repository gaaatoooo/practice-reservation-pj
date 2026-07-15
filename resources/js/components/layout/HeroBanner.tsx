import { Link } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';

// ⭕️ スライドに表示するホテルの画像URLリスト（フリー素材やプロジェクト内の画像に差し替えてください）
const IMAGES = [
    '/storage/img/hotel-front.png', // ホテルのフロントの画像
    '/storage/img/hotel-out.png',   // ホテルの外観の画像
    '/storage/img/hotel-sight.png', // ホテルの客室内から見える夜景の画像
];

export default function HeroBanner() {
    const [currentIndex, setCurrentIndex] = useState(0);

    // ⭕️ 指定時間ごと（例: 5秒）にインデックスを自動で切り替える
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % IMAGES.length);
        }, 5000); // 5000ms = 5秒ごとに次の画像へ変更

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full h-[450px] md:h-[550px] bg-slate-950 overflow-hidden shadow-md">
            
            {/* 🖼️ 画像エリア：不透明度を opacity-50 から opacity-85 に上げて明るく鮮やかに */}
            {IMAGES.map((src, index) => (
                <div
                    key={src}
                    className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[2000ms] ease-in-out ${
                        index === currentIndex ? 'opacity-85' : 'opacity-0'
                    }`}
                    style={{ backgroundImage: `url(${src})` }}
                />
            ))}

            {/* 🌁 グラデーションオーバーレイ：文字の視認性を保ちつつ、画像の明るさを遮らない薄さに調整 */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-slate-950/40" />

            {/* 🧭 ナビゲーションヘッダー（既存のまま） */}
            <div className="absolute top-0 inset-x-0 z-20 text-white">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-xl font-serif font-bold tracking-widest text-amber-400">GRAND RESORT</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-6 text-xs font-semibold tracking-wider text-slate-200">
                        <Link 
                            href="/user/rooms" 
                            className="hover:text-amber-400 transition-colors cursor-pointer"
                        >
                            客室紹介
                        </Link>
                        <Link 
                            href="/user/hotel-info" 
                            className="hover:text-amber-400 transition-colors cursor-pointer"
                        >
                            館内施設
                        </Link>
                        <Link 
                            href="/user/hotel-info#access" 
                            className="hover:text-amber-400 transition-colors cursor-pointer"
                        >
                            アクセス
                        </Link>
                    </div>
                </div>
            </div>

            {/* ✍️ キャッチコピーエリア（白文字の陰影を強化して、画像が明るくなっても文字がハッキリ読めるように調整） */}
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white px-4 select-none drop-shadow-[0_4px_6px_rgba(0,0,0,0.7)]">
                <p className="text-xs md:text-sm font-serif tracking-[0.3em] uppercase text-amber-400 font-bold mb-3 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    Welcome to Luxury Experience
                </p>
                <h1 className="text-2xl md:text-3xl font-serif font-bold tracking-widest leading-relaxed max-w-2xl text-slate-100 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
                    洗練された空間で、<br className="sm:hidden" />極上のひとときを
                </h1>
                <div className="w-75 h-[1px] bg-amber-400 mt-6 animate-in fade-in duration-1000 delay-500" />
            </div>
        </div>
    );
}
