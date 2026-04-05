async function main() {
  const res = await fetch('https://www.pilio.idv.tw/lto/list.asp', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      'Accept': 'text/html',
    }
  });
  const html = await res.text();
  const start = html.indexOf('03/');
  console.log(html.substring(start - 50, start + 500));
}
main();
