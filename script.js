document.addEventListener('DOMContentLoaded', function () {
  const fromCurrencySelect = document.getElementById('fromCurrency');
  const toCurrencySelect = document.getElementById('toCurrency');
  const swapButton = document.getElementById('swapButton');
  const apiKey = '10c926d4dc859726ed7b53db';

  // Convert country code to emoji flag
  function getFlagEmoji(code) {
    const countryCode = code.slice(0, 2).toUpperCase();
    return String.fromCodePoint(...[...countryCode].map(c => 127397 + c.charCodeAt()));
  }

  // Populate dropdowns with flags and names
  fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/codes`)
    .then(response => response.json())
    .then(data => {
      if (data.result === 'success') {
        data.supported_codes.forEach(([code, name]) => {
          const label = `${getFlagEmoji(code)} ${code} - ${name}`;
          const optionFrom = new Option(label, code);
          const optionTo = new Option(label, code);
          fromCurrencySelect.add(optionFrom);
          toCurrencySelect.add(optionTo);
        });
        fromCurrencySelect.value = 'USD';
        toCurrencySelect.value = 'CAD';
        convertCurrency();
      }
    })
    .catch(error => {
      console.error('Error loading currency codes:', error);
    });

  // Swap logic
  swapButton.addEventListener('click', () => {
    const temp = fromCurrencySelect.value;
    fromCurrencySelect.value = toCurrencySelect.value;
    toCurrencySelect.value = temp;
    convertCurrency();
  });

  // Auto-convert on change/input
  document.getElementById('amount').addEventListener('input', convertCurrency);
  fromCurrencySelect.addEventListener('change', convertCurrency);
  toCurrencySelect.addEventListener('change', convertCurrency);
});

// Core conversion logic
function convertCurrency() {
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

  fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}`)
    .then(response => response.json())
    .then(data => {
      if (data.result === 'success') {
        const rate = data.conversion_rate;
        const converted = (rate * amount).toFixed(2);
        const updated = new Date(data.time_last_update_utc);
        resultDiv.textContent = `${amount} ${from} = ${converted} ${to}`;
        timeDiv.textContent = `Last updated: ${updated.toLocaleString()}`;
      } else {
        resultDiv.textContent = 'Conversion failed. Please try again.';
        timeDiv.textContent = '';
      }
    })
    .catch(error => {
      resultDiv.textContent = 'Error fetching exchange rate.';
      timeDiv.textContent = '';
      console.error('Fetch error:', error);
    });
}
