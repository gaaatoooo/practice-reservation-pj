import { Link } from '@inertiajs/react';
import React from 'react';

// 💡 Laravelのペジネーションから届くリンクの型定義
interface LinkItem {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    // 💡 LaravelのPaginatorオブジェクトから必要なメタ情報だけを受け取る
    meta: {
        links: LinkItem[];
        current_page?: number;
        last_page?: number;
        total: number;
        from?: number;
        to?: number;
    };
}

export default function Pagination({ meta }: PaginationProps) {
    // ページ数が1ページ以下の場合は何も表示しない
    if (!meta.links || meta.links.length <= 3) {
        return null;
    }

    return (
        <div className="flex items-center justify-between border-t border-slate-200 bg-white px-4 py-3 sm:px-6 mt-4 rounded-lg shadow-sm">
            {/* モバイル用（簡易表示：前へ・次へ） */}
            <div className="flex flex-1 justify-between sm:hidden">
                <Link
                    href={meta.links[0].url || '#'}
                    onClick={(e) => !meta.links[0].url && e.preventDefault()}
                    className={`relative inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 ${
                        !meta.links[0].url ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    前へ
                </Link>
                <Link
                    href={meta.links[meta.links.length - 1].url || '#'}
                    onClick={(e) => !meta.links[meta.links.length - 1].url && e.preventDefault()}
                    className={`relative ml-3 inline-flex items-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 ${
                        !meta.links[meta.links.length - 1].url ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    次へ
                </Link>
            </div>

            {/* PC用（ページ番号リスト） */}
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-slate-700">
                        全 <span className="font-medium">{meta.total}</span> 件中{' '}
                        {meta.from && meta.to ? (
                            <>
                                <span className="font-medium">{meta.from}</span>～
                                <span className="font-medium">{meta.to}</span> 件目を表示
                            </>
                        ) : (
                            '表示中'
                        )}
                    </p>
                </div>
                <div>
                    <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        {meta.links.map((link, index) => {
                            // 💡 矢印記号のテキストをきれいに整形
                            let label = link.label;

                            if (label.includes('Previous')) {
                                label = '‹';
                            }

                            if (label.includes('Next')) {
                                label = '›';
                            }

                            return (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    onClick={(e) => !link.url && e.preventDefault()}
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold transition-colors focus:z-20 ${
                                        link.active
                                            ? 'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                                            : 'text-slate-900 ring-1 ring-inset ring-slate-300 hover:bg-slate-50 focus:outline-offset-0'
                                    } ${!link.url ? 'opacity-40 cursor-not-allowed' : ''}`}
                                >
                                    <span dangerouslySetInnerHTML={{ __html: label }} />
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </div>
    );
}
