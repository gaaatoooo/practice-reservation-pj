<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use OpenAI\Laravel\Facades\OpenAI;
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
            // OpenAI APIを呼び出し
            $response = OpenAI::chat()->create([
                'model' => 'gpt-4o-mini', // 高速かつ低コストなモデルを推奨
                'messages' => [
                    ['role' => 'system', 'content' => $systemPrompt],
                    ['role' => 'user', 'content' => $userMessage],
                ],
                'temperature' => 0.3, // 回答のブレ（嘘）を減らすために低めに設定
            ]);

            log::alert($response);

            $aiResponse = $response->choices[0]->message->content;

            return response()->json([
                'status' => 'success',
                'reply' => $aiResponse,
            ]);

        } catch (\Exception $e) {
            \Log::error('AIチャットエラー: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'reply' => '申し訳ありません。システムに一時的な問題が発生しています。しばらく経ってから再度お試しください。',
            ], 500);
        }
    }
}
