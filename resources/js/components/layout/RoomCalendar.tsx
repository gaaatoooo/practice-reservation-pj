// resources/js/Components/RoomCalendar.tsx（または現在の配置パス）
import { ja } from 'date-fns/locale';
import { useState, useEffect } from 'react';
import { DayPicker, type DayButtonProps } from 'react-day-picker';
import { type AvailableRoom } from './RoomAvailabilityCard';
import RoomAvailabilityModal from './RoomAvailabilityModal';
import 'react-day-picker/dist/style.css';

export default function RoomCalendar() {
    const [month, setMonth] = useState<Date>(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [availability, setAvailability] = useState<Record<string, number>>({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalDateStr, setModalDateStr] = useState('');
    const [availableRooms, setAvailableRooms] = useState<AvailableRoom[]>([]);
    const [isLoadingRooms, setIsLoadingRooms] = useState(false);

    const startMonth = new Date();
    const endMonth = new Date(new Date().getFullYear() +3, 11);

    useEffect(() => {
        fetch('/api/room-availability')
            .then((res) => res.json())
            .then((data) => setAvailability(data))
            .catch((err) => console.error('データ取得エラー:', err));
    }, []);

    const handleDayClick = (date: Date, dateStr: string) => {
        setSelectedDate(date);
        setModalDateStr(dateStr);
        setIsLoadingRooms(true);
        setIsModalOpen(true);

        fetch(`/api/room-availability/rooms?date=${dateStr}`)
            .then((res) => res.json())
            .then((data) => {
                setAvailableRooms(data);
                setIsLoadingRooms(false);
            })
            .catch((err) => {
                console.error('部屋データ取得エラー:', err);
                setIsLoadingRooms(false);
            });
    };

    const CustomDayButton = (props: DayButtonProps) => {
        const currentDate = props.day.date;
        const offset = currentDate.getTimezoneOffset() * 60000;
        const localISODate = new Date(currentDate.getTime() - offset).toISOString().split('T')[0];
        
        const status = availability[localISODate];

        let statusText = '○';
        let statusColor = 'text-green-500';

        if (!status) {
            statusText = '○';
            statusColor = 'text-green-500';
        } else if (status === 2) {
            statusText = '△';
            statusColor = 'text-yellow-500';
        } else if (status === 3) {
            statusText = '×';
            statusColor = 'text-red-500';
        }

        const isToday = new Date().toDateString() === currentDate.toDateString();
        const isSelected = selectedDate?.toDateString() === currentDate.toDateString();

        // 📄 対象ファイル内の修正箇所（CustomDayButtonのreturn部分）

        return (
            <button
                type="button"
                onClick={() => handleDayClick(currentDate, localISODate)}
                // ⭕️ 修正：aspect-[4/5] を廃止し、横幅いっぱい・縦幅固定（w-full h-14）に上書き
                className={`w-full h-13 flex flex-col items-center justify-between rounded-lg text-sm transition-colors p-1
                ${isSelected ? 'bg-blue-500 text-white' : 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700'}
                ${isToday && !isSelected ? 'border border-blue-500' : ''}`}
            >
                <span className={isSelected ? 'text-white' : 'text-neutral-950 dark:text-neutral-50'}>
                    {currentDate.getDate()}
                </span>
                <span className={`text-xs font-bold ${isSelected ? 'text-white/90' : statusColor}`}>
                    {statusText}
                </span>
            </button>
        );

    };

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto">
            <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                // ⭕️ 内部の月移動ステートとイベントをバインド
                month={month}
                onMonthChange={setMonth}
                // ⭕️ 年月のキャプション表現を「ドロップダウン（セレクト）」に変更
                captionLayout="dropdown"
                // ⭕️ セレクト可能範囲の下限と上限を指定
                startMonth={startMonth}
                endMonth={endMonth}
                locale={ja}
                components={{ DayButton: CustomDayButton }}
                // ⭕️ 修正：classNameに公式の大画面用クラス「rdp-xl」と、レスポンシブ用の独自クラスを追加
                className="border p-4 rounded-xl bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 w-full rdp-v9-liquid"
            />

            {/* ⭕️ 追記：react-day-picker v9専用の完全幅100%均等化CSS */}
            <style>{`
                /* カレンダーの月コンテナ・グリッド全体を100%に広げる */
                .rdp-v9-liquid,
                .rdp-v9-liquid .rdp-months,
                .rdp-v9-liquid .rdp-month,
                .rdp-v9-liquid .rdp-month_grid {
                    width: 100% !important;
                    max-width: 100% !important;
                }

                /* ⭕️ セレクトボックス化に伴い、ヘッダーのフレックス配置を最適化 */
                .rdp-v9-liquid .rdp-caption {
                    display: flex !important;
                    justify-content: space-between !important;
                    align-items: center !important;
                    width: 100% !important;
                    margin-bottom: 1.5rem !important;
                    padding: 0 0.5rem !important;
                }

                /* ⭕️ ライブラリが自動生成するセレクトボックスコンテナの調整 */
                .rdp-v9-liquid .rdp-dropdowns {
                    display: flex !important;
                    gap: 0.5rem !important;
                }
                
                /* ⭕️ セレクトボックス自体のTailwind風フラットデザイン化 */
                .rdp-v9-liquid .rdp-dropdown select {
                    padding: 0.35rem 1.75rem 0.35rem 0.75rem !important;
                    font-size: 0.875rem !important;
                    font-weight: 600 !important;
                    border: 1px border-slate-200 !important;
                    border-radius: 0.5rem !important;
                    background-color: #f8fafc !important;
                    color: #0f172a !important;
                    cursor: pointer !important;
                }

                /* 曜日（日月火水木金土）の行を7等分の均等配置に上書き */
                .rdp-v9-liquid .rdp-weekdays {
                    display: grid !important;
                    grid-template-columns: repeat(7, 1fr) !important;
                    justify-items: center !important;
                    width: 100% !important;
                    margin-bottom: 0.5rem !important;
                }
                .rdp-v9-liquid .rdp-weekday {
                    width: 100% !important;
                    text-align: center !important;
                    font-weight: 600 !important;
                }

                /* 日付のメインコンテナ（weeks）をGridシステム化 */
                .rdp-v9-liquid .rdp-weeks {
                    display: flex !important;
                    flex-direction: column !important;
                    gap: 0.5rem !important;
                    width: 100% !important;
                }

                /* 1週間ごとの行（week）を、固定幅を無視して確実に7等分の均等横並びにする */
                .rdp-v9-liquid .rdp-week {
                    display: grid !important;
                    grid-template-columns: repeat(7, 1fr) !important;
                    justify-items: center !important;
                    width: 100% !important;
                }

                /* 日付ボタンを囲む親ラッパー */
                .rdp-v9-liquid .rdp-day {
                    width: 100% !important;
                    max-width: 100% !important;
                    display: flex !important;
                    justify-content: center !important;
                    align-items: center !important;
                }
            `}</style>

            <div className="flex gap-4 mt-6 text-xs text-neutral-500">
                <span><strong className="text-green-500">◯</strong> 空室あり</span>
                <span><strong className="text-yellow-500">△</strong> 残りわずか</span>
                <span><strong className="text-red-500">×</strong> 満室</span>
            </div>

            <RoomAvailabilityModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                dateStr={modalDateStr}
                rooms={availableRooms}
                isLoading={isLoadingRooms}
            />
        </div>
    );

}
