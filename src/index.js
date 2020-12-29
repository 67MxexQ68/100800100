new gridjs.Grid
({
  columns: ['Exchange', 'Maker %', 'Taker %', 'BTC fee', 'ETH fee', 'LTC fee',  'Link'],
  sort: true,
  fixedHeader: true,
  server: {
    url: 'src/db.json',
    then: data => data.map(crypto => [
      crypto.name,
      crypto.maker,
      crypto.taker,
      crypto.btc,
      crypto.eth,
      crypto.ltc,
      gridjs.html(`<a class="btn btn-outline-primary" href='${crypto.affiliate}'>maak account</a>`)
    ])
  }
}).render(document.getElementById("table-overview"));
