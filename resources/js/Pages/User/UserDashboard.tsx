/* global route */
import { Head } from '@inertiajs/react';
import FairSlider from '@/components/layout/FairSlider';
import NoticeList from '@/components/layout/NoticeList';
import RoomCalendar from '@/components/layout/RoomCalendar';

export default function UserDashboard() {
    return (
        <>
            <Head title="宿泊予約画面" />
            <div className="m-2">
                <div className="md:grid gap-2 mb-2 grid-cols-1 md:grid-cols-2">
                    {/* カレンダーエリア */}
                    <div className="p-6 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm flex flex-col w-full">
                        <h2 className="text-lg font-semibold mb-4 text-neutral-800 dark:text-neutral-200">
                            空室状況カレンダー
                        </h2>
                        
                        {/* ⬇️ コンポーネントを配置 */}
                        <div className="w-full flex justify-center">
                            <RoomCalendar />
                        </div>
                    </div>

                    {/* 右側の空きスペース */}
                    <div className="md:col-span-1 flex w-full gap-4">
                        <div className="p-6 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm min-h-[150px] w-full">
                            <h3 className="font-semibold mb-2">お知らせ</h3>
                            <NoticeList />
                        </div>
                    </div>
                </div>
                <div>
                    <div className="p-6 bg-white dark:bg-neutral-800 rounded-2xl border border-neutral-200 dark:border-neutral-700 shadow-sm min-h-[150px]">
                        <FairSlider />
                    </div>
                </div>
            </div>
        </>
    );
}
