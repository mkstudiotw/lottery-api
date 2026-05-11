const fs = require('fs');
const path = require('path');

async function fetchPage(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'text/html' }
  });
  return res.text();
}

function parseDraws(html, ballCount, hasBonus) {
  const rows = [];
  const dateR = /date-cell[^>]*>([\d\/]+)<br>/g;
  const numR = /number-cell[^>]*>\s*([\d,&nbsp;\s]+?)\s*<\/td>/g;
  const bonusR = /bonus-cell[^>]*>([\d]+)<\/td>/g;
  const dates = [], nums = [], bonuses = [];
  let m;
  while ((m = dateR.exec(html)) !== null) dates.push(m[1]);
  while ((m = numR.exec(html)) !== null) nums.push(m[1]);
  while ((m = bonusR.exec(html)) !== null) bonuses.push(m[1]);
  for (let i = 0; i < dates.length; i++) {
    const parts = dates[i].trim().split('/');
    const month = parts[0].padStart(2,'0');
    const day = parts[1].padStart(2,'0');
    const balls = (nums[i]||'').replace(/&nbsp;/g,'').split(',')
      .map(s => parseInt(s.trim()))
      .filter(n => !isNaN(n) && n >= 0);
    if (balls.length === ballCount) {
      const row = { date: '2026/'+month+'/'+day, balls };
      if (hasBonus && bonuses[i]) row.special = parseInt(bonuses[i]);
      rows.push(row);
    }
  }
  return rows;
}

module.exports = async (req, res) => {
  // 驗證 Cron Secret 防止外人亂呼叫
  if (req.headers['authorization'] !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  try {
    const pages = await Promise.all([
      fetchPage('https://www.pilio.idv.tw/lto/list.asp'),
      fetchPage('https://www.pilio.idv.tw/ltobig/list.asp'),
      fetchPage('https://www.pilio.idv.tw/lto539/list.asp'),
    ]);
    const superlotto = parseDraws(pages[0], 6, true);
    const lotto = parseDraws(pages[1], 6, true);
    const daily539 = parseDraws(pages[2], 5, false);
    
    const result = {
      superlotto, lotto, daily539,
      star3: [], star4: [],
      lastUpdated: new Date().toISOString()
    };
    
    fs.writeFileSync(
      path.join(process.cwd(), 'api/data.json'),
      JSON.stringify(result, null, 2)
    );
    
    res.json({ 
      success: true, 
      lastUpdated: result.lastUpdated,
      counts: {
        superlotto: superlotto.length,
        lotto: lotto.length,
        daily539: daily539.length
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
