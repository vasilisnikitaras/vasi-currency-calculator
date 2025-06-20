document.addEventListener('DOMContentLoaded', function () {
  const fromCurrencySelect = document.getElementById('fromCurrency');
  const toCurrencySelect = document.getElementById('toCurrency');
  const amountInput = document.getElementById('amount');
  const resultDiv = document.getElementById('result');
  const timeDiv = document.getElementById('lastUpdated');
  const swapButton = document.getElementById('swapButton');
  const apiKey = '10c926d4dc859726ed7b53db';

  function getFlagEmoji(code) {
    const countryCode = code.slice(0, 2).toUpperCase();
    return String.fromCodePoint(...[...countryCode].map(c => 127397 + c.charCodeAt()));
  }

  function convertCurrency() {
  const amount = parseFloat(amountInput.value);
  const from = fromCurrencySelect.value;
  const to = toCurrencySelect.value;

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

        resultDiv.style.opacity = 0;
        resultDiv.textContent = `${amount} ${from} = ${converted} ${to}`;
        setTimeout(() => {
          resultDiv.style.animation = 'fadeIn 0.3s ease-in-out forwards';
        }, 10);

        timeDiv.textContent = `Last updated: ${updated.toLocaleString()}`;
      } else {
        resultDiv.textContent = 'Conversion failed. Try again.';
        timeDiv.textContent = '';
      }
    })
    .catch(error => {
      resultDiv.textContent = 'Error fetching exchange rate.';
      timeDiv.textContent = '';
      console.error('API Error:', error);
    });
}


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
      console.error('Error loading currency list:', error);
    });

  swapButton.addEventListener('click', () => {
    const temp = fromCurrencySelect.value;
    fromCurrencySelect.value = toCurrencySelect.value;
    toCurrencySelect.value = temp;
    convertCurrency();
  });

  amountInput.addEventListener('input', convertCurrency);
  fromCurrencySelect.addEventListener('change', convertCurrency);
  toCurrencySelect.addEventListener('change', convertCurrency);
});
