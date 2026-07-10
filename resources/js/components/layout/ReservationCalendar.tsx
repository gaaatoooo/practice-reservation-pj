import { ja } from 'date-fns/locale';
import React, { useState, useEffect } from 'react';
import { DayPicker, type DayButtonProps, type DateRange } from 'react-day-picker';

interface ReservationCalendarProps {
    range: DateRange | undefined;
    setRange: (range: DateRange | undefined) => void;
    startDateStr: string;
    endDateStr: string;
}

export default function ReservationCalendar({ range, setRange, startDateStr, endDateStr }: ReservationCalendarProps) {
    const [month, setMonth] = useState<Date>(new Date());
    const [availability, setAvailability] = useState<Record<string, number>>({});

    const startMonth = new Date();
    const endMonth = new Date(new Date().getFullYear() +3, 11);

    // 画面表示時にカレンダー用の空室状況データを高速APIフェッチ
    useEffect(() => {
        fetch('/api/room-availability')
            .then((res) => res.json())
            .then((data) => setAvailability(data))
            .catch((err) => console.error('データ取得エラー:', err));
    }, []);

    // 範囲選択に対応した、空室記号付きカスタム日付ボタン
    const ReservationDayButton = (props: DayButtonProps) => {
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
        
        // ⭕️ 修正：バージョン9仕様の範囲選択状態の判定
        const isSelected = props.modifiers?.selected || false;

        return (
            <button
                // ⭕️ 修正：buttonPropsの廃止に伴い、propsオブジェクトそのものを直接展開（スプレッド）
                {...props}
                type="button"
                disabled={status === 3 || currentDate < new Date(new Date().setHours(0,0,0,0))}
                className={`w-full h-13 flex flex-col items-center justify-between rounded-lg text-sm transition-colors p-1 relative
                ${isSelected 
                    ? 'bg-blue-500 text-white!' 
                    : 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }
                ${isToday && !isSelected ? 'border border-blue-500' : ''}
                disabled:bg-neutral-50 disabled:text-neutral-300 disabled:cursor-not-allowed`}
            >
                {/* 日付の数字 */}
                <span className={isSelected ? 'text-white font-bold' : 'text-neutral-950 dark:text-neutral-50'}>
                    {currentDate.getDate()}
                </span>
                {/* ○・△・× の記号 */}
                <span className={`text-xs font-black ${isSelected ? 'text-white/90' : statusColor}`}>
                    {statusText}
                </span>
            </button>
        );
    };

    const formattedStartDate = new Date(startDateStr).toLocaleDateString('ja-JP', {
        year: 'numeric', month: '2-digit', day: '2-digit'
    }).replace(/\//g, '/');

    const formattedEndDate = new Date(endDateStr).toLocaleDateString('ja-JP', {
        year: 'numeric', month: '2-digit', day: '2-digit'
    }).replace(/\//g, '/');

    return (
        <div className="bg-white dark:bg-neutral-800 p-6 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm flex flex-col items-center w-full">
            <h2 className="text-base font-bold text-neutral-800 dark:text-neutral-200 border-l-4 border-blue-600 pl-2 self-start mb-4">
                📅 宿泊日程の選択
            </h2>
            
            <DayPicker 
                mode="range" 
                selected={range} 
                onSelect={setRange} 
                // ⭕️ 内部の月移動ステートとイベントをバインド
                month={month}
                onMonthChange={setMonth}
                // ⭕️ 年月のキャプション表現を「ドロップダウン（セレクト）」に変更
                captionLayout="dropdown"
                // ⭕️ セレクト可能範囲の下限と上限を指定
                startMonth={startMonth}
                endMonth={endMonth}
                locale={ja} 
                min={1} 
                disabled={[
                    { before: new Date() },
                    (date) => {
                        const offset = date.getTimezoneOffset() * 60000;
                        const dateStr = new Date(date.getTime() - offset).toISOString().split('T')[0];
                        
                        return availability[dateStr] === 3;
                    }
                ]} 
                components={{ DayButton: ReservationDayButton }}
                className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-xl w-full rdp-v9-liquid" 
            />

            <style>{`
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
                .rdp-v9-liquid .rdp-weeks {
                    display: flex !important;
                    flex-direction: column !important;
                    gap: 0.5rem !important;
                    width: 100% !important;
                }
                .rdp-v9-liquid .rdp-week {
                    display: grid !important;
                    grid-template-columns: repeat(7, 1fr) !important;
                    justify-items: center !important;
                    width: 100% !important;
                }
                .rdp-v9-liquid .rdp-day {
                    width: 100% !important;
                    max-width: 100% !important;
                    height: auto !important;
                    display: flex !important;
                    justify-content: center !important;
                    align-items: center !important;
                }
            `}</style>

            <div className="flex gap-4 mt-4 text-xs text-neutral-500">
                <span><strong className="text-green-500">◯</strong> 空室あり</span>
                <span><strong className="text-yellow-500">△</strong> 残りわずか</span>
                <span><strong className="text-red-500">×</strong> 満室（選択不可）</span>
            </div>

            <div className="mt-4 flex gap-6 text-sm font-mono text-neutral-600 dark:text-neutral-400 bg-neutral-50 dark:bg-neutral-900/50 px-4 py-2 rounded-xl w-full justify-center">
                <div>チェックイン: <span className="font-bold text-neutral-900 dark:text-neutral-100">{formattedStartDate || '未選択'}</span></div>
                <div>チェックアウト: <span className="font-bold text-neutral-900 dark:text-neutral-100">{formattedEndDate || '未選択'}</span></div>
            </div>
        </div>
    );
}
