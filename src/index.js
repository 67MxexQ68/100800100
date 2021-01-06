let exchangeFees
new gridjs.Grid

({
  columns: ['Exchange', 'Maker', 'Taker %', 'iDeal', '🇳🇱', 'Link'],
  sort: true,
  fixedHeader: true,
  autoWidth: true,
  server: {
    url: 'src/db.json',
    then: (data) => {
      exchangeFees = data;
      return data.map(crypto => [
        crypto.name,
        crypto.maker,
        crypto.taker,
        crypto.ideal,
        crypto.langNL,
        gridjs.html(`<a class="btn btn-outline-primary" href='${crypto.affiliate}'>maak account</a>`)
      ])
    }
  }
}).render(document.getElementById("table-overview"));

function calculateFeesByExchange(exchangeFee) {
  const amountOfEuro = Number(document.getElementById("amountOfEuro").value)
  const selectedCrypto = document.getElementById("cryptoCurrency").value
  if (document.getElementById("cryptoCurrencyWithdrawal").value == "cryptoWithdraw") {
     fee = Number((amountOfEuro / currencyPrice) * (exchangeFee.taker / 100) + exchangeFee[selectedCrypto]);
   } else {
     fee = Number((amountOfEuro / currencyPrice) * (exchangeFee.taker / 100));
   }
  return {
    fee,
    remainingAmount: amountOfEuro - fee
  }
}


async function calculateFees() {
  const selectedCrypto = document.getElementById("cryptoCurrency").value
  const currencyPrice = await getCryptoPriceInCurrency(selectedCrypto)
  const formatConfig = {
    style: "currency",
    currency: "EUR", // CNY for Chinese Yen, EUR for Euro
    minimumFractionDigits: 2,
    currencyDisplay: "symbol",
  };
  const dutchNumberFormatter = new Intl.NumberFormat("nl-NL", formatConfig);
  const fees = exchangeFees.map(exchangeFee => {
    const feesByExchange = calculateFeesByExchange(exchangeFee);
    return [
      exchangeFee.name,
      Number((fee * currencyPrice).toFixed(2)), // kosten in euro's
      Number(((feesByExchange.remainingAmount - (fee * currencyPrice)) / currencyPrice).toFixed(8)),
      Number((feesByExchange.remainingAmount) - (fee * currencyPrice).toFixed(2)), // waarde in euro's
      exchangeFee.langNL,
      gridjs.html(`<a class="btn btn-success" href='${exchangeFee.affiliate}' target="_blank" rel="sponsored">Koop via ${exchangeFee.name}</a>`)]
  })

document.getElementById("exchange-table-overview").innerHTML = "";
const henkie = document.getElementById("cryptoCurrency").value

const exchangeFeesGrid = new gridjs.Grid({
columns: [
  {
    name: 'Exchange'
  },
  {
    name: 'Het kost je',
    formatter: (cell) => `${dutchNumberFormatter.format(cell)}`
  },
  {
    name: 'Je ontvangt',
    formatter: (cell) => gridjs.html(`${cell} ${henkie.toUpperCase()}`)
  },
  {
    name: 'Waarde in €',
    formatter: (cell) => `${dutchNumberFormatter.format(cell)}`
  },
  '🇳🇱',
  'Koop'],
className: {
  td: 'calculator-sanka'
},
style: {
  table: {border: '1px solid #ccc'},
  th: {
      'color': '#000',
      'border-bottom': '0px',
      'text-align': 'center'}
},
sort: true,
data: fees
});
exchangeFeesGrid.render(document.getElementById("exchange-table-overview"));
exchangeFeesGrid.forceRender(document.getElementById("exchange-table-overview"));
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
