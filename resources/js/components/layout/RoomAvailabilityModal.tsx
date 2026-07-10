import { useEffect, useState } from 'react';
import RoomAvailabilityCard, { type AvailableRoom } from './RoomAvailabilityCard';

type ModalProps = {
    isOpen: boolean;
    onClose: () => void;
    dateStr: string;
    rooms: AvailableRoom[];
    isLoading: boolean;
};

export default function RoomAvailabilityModal({ isOpen, onClose, dateStr, rooms, isLoading }: ModalProps) {
    // アニメーション用の内部状態
    const [isRendered, setIsRendered] = useState(isOpen);

    // 1. 【背景のスクロール固定】と【フェードアウト用の遅延制御】
    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
            // モーダル表示時は背後の画面をスクロール不可にする
            document.body.style.overflow = 'hidden';
        } else {
            // アニメーション（200ms）が終わってから非表示にする
            const timer = setTimeout(() => setIsRendered(false), 400);
            // モーダルが閉じたらスクロール不可を解除
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }

        // コンポーネントが消える際の安全クリーンアップ
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isRendered) return null;

    // モーダルが閉じているときは何も表示しない
    //if (!isOpen) return null;

    const safeRooms = Array.isArray(rooms) ? rooms : [];

    return (
        /* 
          背景の黒いエリア（フェードイン・アウト）。
          ⭕️ duration-400（0.4秒）に変更し、変化をはっきりさせました。
        */
          <div 
          onClick={onClose}
          className={`fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 transition-opacity duration-400 ease-out
              ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
          `}
      >
          {/* 
            モーダルの白い箱本体（ズームイン・アウト）。
            ⭕️ duration-400 に変更。
            ⭕️ 閉じる時の初期サイズを「scale-90」にすることで、手前へ飛び出してくる動きを大きく強調しました。
          */}
          <div 
              onClick={(e) => e.stopPropagation()}
              className={`bg-white dark:bg-neutral-900 rounded-2xl max-w-xl w-full max-h-[85vh] flex flex-col border border-neutral-200 dark:border-neutral-800 shadow-2xl transition-all duration-400 ease-out
                  ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-4'}
              `}
          >
              
              {/* ヘッダー */}
              <div className="p-5 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center bg-neutral-50 dark:bg-neutral-900 rounded-t-2xl">
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                      📅 {dateStr} の空室状況一覧
                  </h3>
                  <button 
                      onClick={onClose}
                      className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 text-2xl font-semibold leading-none p-1 transition-colors"
                  >
                      &times;
                  </button>
              </div>

              {/* メイン中身（スクロール領域） */}
              <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
                  {isLoading ? (
                      <p className="text-center py-8 text-neutral-400 animate-pulse">空室情報を読み込み中...</p>
                  ) : safeRooms.length === 0 ? (
                      <p className="text-center py-8 text-neutral-500 font-medium">
                          選択されている日付は満室です。
                      </p>
                  ) : (
                      safeRooms.map((room) => (
                          room && (
                              <RoomAvailabilityCard 
                                  key={room.id} 
                                  room={room} 
                                  dateStr={dateStr} 
                              />
                          )
                      ))
                  )}
              </div>
          </div>
      </div>
    );
}
