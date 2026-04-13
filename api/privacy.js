module.exports = async function handler(req, res) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(`<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>隱私權政策 - AI 台灣彩券分析</title>
<style>
body { font-family: -apple-system, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; color: #333; line-height: 1.8; }
h1 { color: #1a1a2e; }
h2 { color: #333; margin-top: 30px; }
</style>
</head>
<body>
<h1>隱私權政策</h1>
<p>最後更新日期：2026年4月13日</p>
<p>AI 台灣彩券分析重視您的隱私權。本政策說明我們如何處理您的資料。</p>
<h2>收集的資料</h2>
<p>本 App <strong>不收集任何個人資料</strong>。我們不要求您註冊帳號，不追蹤您的位置，也不收集任何可識別個人身份的資訊。</p>
<h2>使用的資料</h2>
<p>本 App 僅從台灣彩券官方網站抓取公開的開獎號碼資料，用於提供號碼分析功能。所有分析均在您的裝置上本地完成。</p>
<h2>第三方服務</h2>
<p>本 App 使用 Vercel 雲端服務提供開獎資料 API，該服務不會收集或儲存使用者個人資料。</p>
<h2>免責聲明</h2>
<p>本 App 提供之號碼分析與推薦，純屬統計娛樂參考，無法預測或保證中獎號碼。請理性購買。未滿18歲不得購買或兌領彩券。</p>
<h2>聯絡我們</h2>
<p>如有任何問題，請聯絡：maodii0214@gmail.com</p>
</body>
</html>`);
};
