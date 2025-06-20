document.addEventListener('DOMContentLoaded', function () {
  const fromCurrencySelect = document.getElementById('fromCurrency');
  const toCurrencySelect = document.getElementById('toCurrency');
  const apiKey = '10c926d4dc859726ed7b53db';

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
});

document.getElementById('calculateButton').addEventListener('click', function () {
  const amount = parseFloat(document.getElementById('amount').value);
  const fromCurrency = document.getElementById('fromCurrency').value;
  const toCurrency = document.getElementById('toCurrency').value;
  const resultDiv = document.getElementById('result');

  if (isNaN(amount) || amount <= 0) {
    resultDiv.textContent = 'Please enter a valid amount.';
    return;
  }

  const apiKey = '10c926d4dc859726ed7b53db';
  const url = `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${fromCurrency}/${toCurrency}`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.result === 'success') {
        const rate = data.conversion_rate;
        const convertedAmount = amount * rate;
        resultDiv.textContent = `Converted Amount: ${convertedAmount.toFixed(2)} ${toCurrency}`;
      } else {
        resultDiv.textContent = 'Exchange rate not available.';
      }
    })
    .catch(error => {
      resultDiv.textContent = 'Error fetching exchange rates. Please try again later.';
      console.error('API Error:', error);
    });
});
