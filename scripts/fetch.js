const fs = require('fs');

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
      .map(function(s){ return parseInt(s.trim()); })
      .filter(function(n){ return !isNaN(n) && n >= 0; });
    if (balls.length === ballCount) {
      const row = { date: '2026/'+month+'/'+day, balls: balls };
      if (hasBonus && bonuses[i]) row.special = parseInt(bonuses[i]);
      rows.push(row);
    }
  }
  return rows;
}

async function main() {
  console.log('開始抓取所有遊戲...');
  const pages = await Promise.all([
    fetchPage('https://www.pilio.idv.tw/lto/list.asp'),
    fetchPage('https://www.pilio.idv.tw/ltobig/list.asp'),
    fetchPage('https://www.pilio.idv.tw/lto539/list.asp'),
  ]);
  const superlotto = parseDraws(pages[0], 6, true);
  const lotto = parseDraws(pages[1], 6, true);
  const daily539 = parseDraws(pages[2], 5, false);
  console.log('威力彩:', superlotto.length, '筆', superlotto[0]?.date);
  console.log('大樂透:', lotto.length, '筆', lotto[0]?.date);
  console.log('今彩539:', daily539.length, '筆', daily539[0]?.date);
  const result = {
    superlotto: superlotto,
    lotto: lotto,
    daily539: daily539,
    star3: [],
    star4: [],
    lastUpdated: new Date().toISOString()
  };
  fs.writeFileSync('api/data.json', JSON.stringify(result, null, 2));
  console.log('全部完成！');
}

main();
