document.addEventListener('DOMContentLoaded', function () {
  const fromCurrencySelect = document.getElementById('fromCurrency');
  const toCurrencySelect = document.getElementById('toCurrency');
  const swapButton = document.getElementById('swapButton');
  const apiKey = '10c926d4dc859726ed7b53db';

  // 🔃 Fetch and populate currency codes
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
        console.error('Failed to load currency codes:', data.error_type);
      }
    })
    .catch(error => {
      console.error('Error fetching currency codes:', error);
    });

  // 🔁 Swap logic
  swapButton.addEventListener('click', () => {
    const temp = fromCurrencySelect.value;
    fromCurrencySelect.value = toCurrencySelect.value;
    toCurrencySelect.value = temp;
  });
});

document.getElementById('calculateButton').addEventListener('click', function () {
  const amount = parseFloat(document.getElementById('amount').value);
  const fromCurrency = document.getElementById('fromCurrency').value;
  const toCurrency = document.getElementById('toCurrency').value;
  const resultDiv = document.getElementById('result');
  const timestampDiv = document.getElementById('lastUpdated');
  const apiKey = '10c926d4dc859726ed7b53db';

  if (isNaN(amount) || amount <= 0) {
    resultDiv.textContent = 'Please enter a valid amount.';
    timestampDiv.textContent = '';
    return;
  }

  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${fromCurrency}/${toCurrency}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.result === 'success') {
        const rate = data.conversion_rate;
        const converted = (amount * rate).toFixed(2);
        const updatedTime = new Date(data.time_last_update_utc);

        resultDiv.textContent = `${amount} ${fromCurrency} = ${converted} ${toCurrency}`;
        timestampDiv.textContent = `Last updated: ${updatedTime.toLocaleString()}`;
      } else {
        resultDiv.textContent = 'Conversion failed. Please try again later.';
        timestampDiv.textContent = '';
      }
    })
    .catch(error => {
      resultDiv.textContent = 'Error fetching exchange rate.';
      timestampDiv.textContent = '';
      console.error('API Error:', error);
    });
});
