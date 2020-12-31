let exchangeFees
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


function calculateFeesByExchange(exchangeFee) {
  const amountOfCrypto = Number(document.getElementById("amountOfCrypto").value)
  const selectedCrypto = document.getElementById("cryptoCurrency").value
  fee = Number(amountOfCrypto * (exchangeFee.taker / 100) + exchangeFee[selectedCrypto])
  return {
    fee,
    remainingAmount: amountOfCrypto - fee
  }
}

async function calculateFees() {
  const selectedCrypto = document.getElementById("cryptoCurrency").value
  const currencyPrice = await getCryptoPriceInCurrency(selectedCrypto)

  const fees = exchangeFees.map(exchangeFee => {
    const feesByExchange = calculateFeesByExchange(exchangeFee);
    return [
      exchangeFee.name,
      feesByExchange.fee.toFixed(4),
      (exchangeFee.btc * currencyPrice).toFixed(4),
      feesByExchange.remainingAmount,
      gridjs.html(`<a class="btn btn-secondary" href='${exchangeFee.affiliate}' target="_blank" rel="sponsored">Koop via ${exchangeFee.name}</a>`)]
  })

  document.getElementById("exchange-table-overview").innerHTML = "";

  const exchangeFeesGrid = new gridjs.Grid({
    columns: ['Exchange', 'Kosten', 'Kosten in euro', 'Netto ontvang je', 'Koop'],
    sort: true,
    data: fees
  });

  exchangeFeesGrid.render(document.getElementById("exchange-table-overview"));
}


function getCryptoPriceInCurrency(cryptoCurrency) {
  const url = `https://api.bitvavo.com/v2/ticker/price?market=${cryptoCurrency.toUpperCase()}-EUR`;
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      // Data contains an object {market: xxx, price: xxx}
        currencyPrice = Number(data.price)
        return currencyPrice
    });
}

/**
 * Show the bitcoin price in euros
 */
// fetch('https://api.bitvavo.com/v2/ticker/price?market=BTC-EUR')
//   .then(response => response.json())
//   .then(data => {
//     // Data contains an object {market: xxx, price: xxx}
//       currencyPrice = Number(data.price)
//       document.getElementById("currencyPrice").innerHTML = currencyPrice
//   });