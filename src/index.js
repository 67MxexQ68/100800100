let exchangeFees
let bitcoinPrice

new gridjs.Grid

({
  columns: ['Exchange', 'Maker %', 'Taker %', 'BTC fee', 'ETH fee', 'LTC fee',  'Link'],
  sort: true,
  fixedHeader: true,
  server: {
    url: 'src/db.json',
    then: (data) => {
      exchangeFees = data;
      return data.map(crypto => [
        crypto.name,
        crypto.maker,
        crypto.taker,
        crypto.btc,
        crypto.eth,
        crypto.ltc,
        gridjs.html(`<a class="btn btn-outline-primary" href='${crypto.affiliate}'>maak account</a>`)
      ])
    }
  }
}).render(document.getElementById("table-overview"));


new gridjs.Grid

function calculateFeesByExchange(exchangeFee) {
  const amountOfCrypto = document.getElementById("amountOfCrypto").value
  const cryptoCurrency = document.getElementById("cryptoCurrency").value
  fee = amountOfCrypto * (exchangeFee.taker / 100) + exchangeFee[cryptoCurrency]
  return {
    fee,
    remainingAmount: amountOfCrypto - fee
  }
}

function calculateFees(exchange) {
  const fees = exchangeFees.map(exchangeFee => {
    const feesByExchange = calculateFeesByExchange(exchangeFee);
    return [
      exchangeFee.name,
      feesByExchange.fee,
      exchangeFee.btc * bitcoinPrice,
      feesByExchange.remainingAmount,
      gridjs.html(`<a class="btn btn-secondary" href='${exchangeFee.affiliate}' target="_blank" rel="sponsored">Koop via ${exchangeFee.name}</a>`)]
  })

  const exchangeFeesGrid = new gridjs.Grid({
    columns: ['Exchange', 'Kosten', 'Kosten in euro', 'Netto ontvang je', 'Koop'],
    sort: true,
    data: fees
  });
  exchangeFeesGrid.render(document.getElementById("exchange-table-overview"));
}


fetch('https://api.bitvavo.com/v2/ticker/price?market=BTC-EUR')
  .then(response => response.json())
  .then(data => {
    // Data contains an object {market: xxx, price: xxx}
      bitcoinPrice = Number(data.price)
      document.getElementById("bitcoinPrice").innerHTML = bitcoinPrice
  });