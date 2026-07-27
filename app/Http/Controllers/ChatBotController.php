<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;

class ChatBotController extends Controller
{
    /**
     * AIコンシェルジュ自動応答API
     */
    public function ask(Request $request): JsonResponse
    {
        $request->validate([
            'message' => 'required|string|max:1000',
        ]);

        $userMessage = $request->input('message');

        // ⭕️ ホテルの仕様をAIに叩き込むシステムプロンプト（前提知識）
        $systemPrompt = "あなたはこの宿泊予約サイトの優秀なAIコンシェルジュです。
        以下のホテルの基本ルールを厳守し、親切かつ簡潔に日本語で回答してください。
        ルールにない質問や、宿泊に関係のない一般的な質問には「恐れ入りますが、詳細についてはお電話にて直接お問い合わせください。」と回答してください。

        【ホテルの基本情報】
        ・チェックイン時間：15:00から / チェックアウト時間：11:00まで
        ・駐車場について：敷地内に50台収容可能な無料駐車場があります。先着順で予約は不要です。高さ制限はありません。
        ・スパについて：最上階に展望大浴場（スパ）があります。宿泊者は無料で利用可能です。営業時間は 6:00〜10:00、15:00〜24:00 です。
        ・朝食について：1階レストランにて和洋バイキングを提供しています。料金は大人2,000円、子供1,000円です。時間は 7:00〜9:30 です。";

        try {
            // 💡 環境変数からGroqのAPIキーを取得
            $apiKey = get_cfg_var('GROQ_API_KEY') ?: ($_ENV['GROQ_API_KEY'] ?? env('GROQ_API_KEY'));

            if (!$apiKey) {
                throw new \Exception('GROQ_API_KEYが設定されていません。');
            }
            
            // 💡 Groq APIへの標準的なリクエスト
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $apiKey,
                'Content-Type' => 'application/json',
            ])->post('https://groq.com', [
                'model' => 'llama-3.1-8b-instant', // 👈 無料枠で確実に動く超高速モデル
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => $userMessage],
                ],
                'temperature' => 0.3,
            ]);

            if ($response->failed()) {
                throw new \Exception('Groq API接続エラー: ' . $response->body());
            }

            $result = $response->json();
            $aiResponse = $result['choices'][0]['message']['content'] ?? null;

            if (!$aiResponse) {
                throw new \Exception('レスポンスの構造解析に失敗しました。');
            }

            return response()->json([
                'status' => 'success',
                'reply' => $aiResponse,
            ]);

        } catch (\Exception $e) {
            Log::error('AIチャットエラー: ' . $e->getMessage());

            return response()->json([
                'status' => 'error',
                'reply' => '申し訳ありません。システムに一時的な問題が発生しています。しばらく経ってから再度お試しください。',
            ], 500);
        }
    }
}
