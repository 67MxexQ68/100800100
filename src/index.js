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
  const amountOfCrypto = document.getElementById("amountOfCrypto").value
  const cryptoCurrency = document.getElementById("cryptoCurrency").value
  fee = amountOfCrypto * exchangeFee.maker * exchangeFee.maker * exchangeFee[cryptoCurrency]
  return {
    fee,
    remainingAmount: amountOfCrypto - fee
  }
}

function calculateFees(exchange) {
  const fees = exchangeFees.map(exchangeFee => {
    const feesByExchange = calculateFeesByExchange(exchangeFee);
    return [exchangeFee.name, feesByExchange.fee, feesByExchange.remainingAmount]
  })

  const exchangeFeesGrid = new gridjs.Grid({
    columns: ['Name', 'Fee', 'Received Amount'],
    data: fees
  });
  exchangeFeesGrid.render(document.getElementById("exchange-table-overview"));
}
