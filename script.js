document.addEventListener('DOMContentLoaded', function () {
  const fromCurrencySelect = document.getElementById('fromCurrency');
  const toCurrencySelect = document.getElementById('toCurrency');
  const swapButton = document.getElementById('swapButton');
  const apiKey = '10c926d4dc859726ed7b53db';

  // Load all supported currencies
  fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/codes`)
    .then(response => response.json())
    .then(data => {
      if (data.result === 'success') {
        data.supported_codes.forEach(([code, name]) => {
          const optionFrom = new Option(`${name} (${code})`, code);
          const optionTo = new Option(`${name} (${code})`, code);
          fromCurrencySelect.add(optionFrom);
          toCurrencySelect.add(optionTo);
        });
        fromCurrencySelect.value = 'USD';
        toCurrencySelect.value = 'CAD';
      } else {
        console.error('Currency code fetch failed:', data['error-type']);
      }
    })
    .catch(error => {
      console.error('Error fetching currency list:', error);
    });

  // Swap currencies on button click
  swapButton.addEventListener('click', () => {
    const temp = fromCurrencySelect.value;
    fromCurrencySelect.value = toCurrencySelect.value;
    toCurrencySelect.value = temp;
  });
});

document.getElementById('calculateButton').addEventListener('click', function () {
  const amount = parseFloat(document.getElementById('amount').value);
  const from = document.getElementById('fromCurrency').value;
  const to = document.getElementById('toCurrency').value;
  const resultDiv = document.getElementById('result');
  const timeDiv = document.getElementById('lastUpdated');
  const apiKey = '10c926d4dc859726ed7b53db';

  if (isNaN(amount) || amount <= 0) {
    resultDiv.textContent = 'Please enter a valid amount.';
    timeDiv.textContent = '';
    return;
  }

  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.result === 'success') {
        const rate = data.conversion_rate;
        const converted = (rate * amount).toFixed(2);
        const updated = new Date(data.time_last_update_utc);
        resultDiv.textContent = `${amount} ${from} = ${converted} ${to}`;
        timeDiv.textContent = `Last updated: ${updated.toLocaleString()}`;
      } else {
        resultDiv.textContent = 'Exchange rate not available.';
        timeDiv.textContent = '';
      }
    })
    .catch(error => {
      resultDiv.textContent = 'Error fetching exchange rate.';
      timeDiv.textContent = '';
      console.error('API Error:', error);
    });
});
