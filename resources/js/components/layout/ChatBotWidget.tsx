import axios from 'axios';
import { MessageSquare, X, Send, Loader2 } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

type Message = {
    sender: 'user' | 'ai';
    text: string;
};

export default function ChatBotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [showWelcome, setShowWelcome] = useState(true);
    const [showFaq, setShowFaq] = useState(true);
    
    // 💬 チャット履歴、入力文字、ローディングステート
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'ai', text: 'ご来館ありがとうございます！AIコンシェルジュです。ご質問がございましたらお気軽にどうぞ。' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    // メッセージ追加時に最下部へ自動スクロール
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // メッセージ送信処理
    const handleSendMessage = async (textToSend: string) => {
        if (!textToSend.trim() || isLoading) {
            return;
        }

        // 1. ユーザーのメッセージを画面に追加
        const newMessages = [...messages, { sender: 'user' as const, text: textToSend }];
        setMessages(newMessages);
        setInputText('');
        setIsLoading(true);

        try {
            // 2. LaravelバックエンドのAPIを叩く
            // ⭕️ axios.post の後ろに型を定義する（または response: any とする）
            const response = await axios.post<{ reply: string }>('/api/chatbot/ask', { message: textToSend });
            
            // 3. AIの返答を画面に追加
            setMessages([...newMessages, { sender: 'ai', text: response.data.reply }]);
        } catch (error) {
            // ⭕️ エラーメッセージをログに残す（必要に応じて）
            console.error(error);
            setMessages([...newMessages, { sender: 'ai', text: '通信エラーが発生しました。時間を置いてお試しください。' }]);
        } finally {
            setIsLoading(false);
        }
    };

    // よくある質問ボタンを押した時の自動送信
    const handleFaqClick = (topic: string) => {
        setIsOpen(true);
        setShowWelcome(false);
        setShowFaq(false);
        handleSendMessage(`${topic}について教えてください。`);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans antialiased flex flex-col items-end gap-3 select-none">
            {/* --- 1. よくある質問パネル --- */}
            {showFaq && !isOpen && (
                <div className="bg-white border border-slate-200 rounded-xl shadow-lg p-5 w-64 relative">
                    <button onClick={() => setShowFaq(false)} className="absolute -top-2 -right-2 bg-white border border-slate-200 text-slate-400 rounded-full p-1 shadow-sm"><X className="w-3 h-3" /></button>
                    <h3 className="text-sm font-bold text-slate-800 text-center mb-3">よくある質問</h3>
                    <div className="flex flex-col gap-2">
                        <button onClick={() => handleFaqClick('駐車場')} className="w-full bg-slate-600 hover:bg-slate-700 text-white text-xs font-medium py-2.5 rounded-lg shadow-sm">駐車場について</button>
                        <button onClick={() => handleFaqClick('スパ')} className="w-full bg-slate-600 hover:bg-slate-700 text-white text-xs font-medium py-2.5 rounded-lg shadow-sm">スパについて</button>
                    </div>
                </div>
            )}

            {/* --- 2. ウェルカムメッセージ吹き出し --- */}
            {showWelcome && !isOpen && (
                <div className="bg-white border border-slate-200 rounded-xl shadow-md px-4 py-3 max-w-xs relative mr-2">
                    <button onClick={() => setShowWelcome(false)} className="absolute -top-2 -right-2 bg-white border border-slate-200 text-slate-400 rounded-full p-1 shadow-sm"><X className="w-3 h-3" /></button>
                    <p className="text-xs font-medium text-slate-700">AIコンシェルジュがご用件を伺います。</p>
                </div>
            )}

            {/* --- 3. 丸いチャットボタン --- */}
            <button
                type="button"
                onClick={() => { 
                    setIsOpen(!isOpen); 

                    if (!isOpen) { 
                        setShowWelcome(false); setShowFaq(false); 
                    } 
                }}
                className={`flex items-center justify-center w-16 h-16 rounded-full shadow-xl transition-all ${isOpen ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-700'}`}
            >
                {isOpen ? <X className="w-6 h-6" /> : <div className="relative"><MessageSquare className="w-7 h-7" /><span className="absolute -bottom-1 -right-1.5 bg-slate-500 text-white text-[9px] font-bold w-4 h-4 rounded-sm flex items-center justify-center border border-white">?</span></div>}
            </button>

            {/* --- 4. 拡張されたメインチャットウィンドウ --- */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 bg-white border border-slate-200 w-80 h-[450px] rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-8 duration-300">
                    <div className="bg-slate-900 text-white p-4 font-bold text-sm">AIコンシェルジュ</div>
                    
                    {/* チャットタイムライン表示 */}
                    <div className="flex-1 p-4 bg-slate-50 overflow-y-auto space-y-3">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed shadow-sm ${msg.sender === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start items-center gap-1.5 text-[11px] text-slate-400">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                <span>AIが回答を考えています...</span>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* テキスト入力フォーム */}
                    <form onSubmit={(e) => { 
                            e.preventDefault(); 
                            handleSendMessage(inputText); 
                        }} 
                        className="p-3 bg-white border-t border-slate-100 flex gap-2">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            disabled={isLoading}
                            placeholder="メッセージを入力してください"
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                        />
                        <button type="submit" disabled={isLoading || !inputText.trim()} className="bg-indigo-600 hover:bg-indigo-500 text-white p-2 rounded-lg transition-colors disabled:opacity-40 shadow-sm flex items-center justify-center">
                            <Send className="w-3.5 h-3.5" />
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
