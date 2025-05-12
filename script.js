document.addEventListener('DOMContentLoaded', function() {
    const currencyList = [
        { code: "USD", name: "United States Dollar" },
        { code: "EUR", name: "Euro" },
        { code: "GBP", name: "British Pound" },
        { code: "CAD", name: "Canadian Dollar" },
        { code: "JPY", name: "Japanese Yen" },
        { code: "AUD", name: "Australian Dollar" },
        { code: "CNY", name: "Chinese Yuan" },
        { code: "INR", name: "Indian Rupee" },
        { code: "BRL", name: "Brazilian Real" },
        { code: "ZAR", name: "South African Rand" },
        { code: "RUB", name: "Russian Ruble" },
        { code: "MXN", name: "Mexican Peso" },
        { code: "CHF", name: "Swiss Franc" },
        { code: "KRW", name: "South Korean Won" },
        { code: "SGD", name: "Singapore Dollar" },
        { code: "HKD", name: "Hong Kong Dollar" },
        { code: "NZD", name: "New Zealand Dollar" },
        { code: "SEK", name: "Swedish Krona" },
        { code: "NOK", name: "Norwegian Krone" },
        { code: "DKK", name: "Danish Krone" },
        { code: "PLN", name: "Polish Zloty" },
        { code: "TRY", name: "Turkish Lira" },
        { code: "THB", name: "Thai Baht" },
        { code: "MYR", name: "Malaysian Ringgit" },
        { code: "IDR", name: "Indonesian Rupiah" },
        { code: "PHP", name: "Philippine Peso" },
        { code: "VND", name: "Vietnamese Dong" },
        { code: "EGP", name: "Egyptian Pound" },
        { code: "SAR", name: "Saudi Riyal" },
        { code: "AED", name: "United Arab Emirates Dirham" },
    ];

    const fromCurrencySelect = document.getElementById('fromCurrency');
    const toCurrencySelect = document.getElementById('toCurrency');

    currencyList.forEach(currency => {
        const optionFrom = document.createElement('option');
        optionFrom.value = currency.code;
        optionFrom.textContent = `${currency.name} (${currency.code})`;

        const optionTo = optionFrom.cloneNode(true);

        fromCurrencySelect.appendChild(optionFrom);
        toCurrencySelect.appendChild(optionTo);
    });
});

document.getElementById('calculateButton').addEventListener('click', function() {
    const amount = parseFloat(document.getElementById('amount').value);
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;

    if (isNaN(amount) || amount <= 0) {
        alert('Please enter a valid amount.');
        return;
    }

    const apiKey = 'YOUR_API_KEY'; // Replace with your free API key
    const url = `https://open.er-api.com/v6/latest/${fromCurrency}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const rate = data.rates[toCurrency];
            if (rate) {
                const convertedAmount = amount * rate;
                document.getElementById('result').innerText = `Converted Amount: ${convertedAmount.toFixed(2)} ${toCurrency}`;
            } else {
                alert('Exchange rate not available.');
            }
        })
        .catch(error => {
            alert('Error fetching exchange rates. Please try again later.');
            console.error('API Error:', error);
        });
});
