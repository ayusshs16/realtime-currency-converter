// script.js
import { currency_list, api } from "./currencyCodes.js";

const fromCurrencySelectTag = document.querySelector("#fromCurrency");
const toCurrencySelectTag = document.querySelector("#toCurrency");
const resultTag = document.querySelector("#result");
const btn = document.querySelector("#btn");
const status = document.querySelector("#status");
const toggle = document.getElementById("darkModeToggle");
const body = document.body;

// Toggle Dark Mode
toggle.addEventListener("change", () => {
    body.classList.toggle("dark-mode");
});

// Populate currency options
currency_list.forEach((currency) => {
    const code = currency[0];
    const countryName = currency[1];

    const newElement = document.createElement("option");
    newElement.value = code;
    newElement.textContent = `${code} - ${countryName}`;

    if (code === "USD") newElement.selected = true;
    fromCurrencySelectTag.append(newElement);

    const newElementTo = newElement.cloneNode(true);
    if (code === "INR") newElementTo.selected = true;
    toCurrencySelectTag.append(newElementTo);
});

// Swap currency
document.getElementById("switchCurrency").onclick = () => {
    const fromValue = fromCurrencySelectTag.value;
    fromCurrencySelectTag.value = toCurrencySelectTag.value;
    toCurrencySelectTag.value = fromValue;
};

// Handle conversion
btn.onclick = () => {
    const numberInputField = document.getElementById("userValue");
    const userEnteredAmount = parseFloat(numberInputField.value);

    if (isNaN(userEnteredAmount) || userEnteredAmount < 1) {
        numberInputField.style.border = "1px solid red";
        resultTag.style.color = "red";
        resultTag.textContent = "Error: Only numeric values greater than 0 are allowed.";
        status.textContent = "";
    } else {
        numberInputField.style.border = "1px solid gray";
        resultTag.style.color = "black";
        btn.textContent = "Processing: have patience...";
        btn.disabled = true;
        btn.style.color = "gray";
        btn.style.cursor = "not-allowed";
        convertAmount(userEnteredAmount);
    }
};

// Convert amount
function convertAmount(amount) {
    const url = `https://v6.exchangerate-api.com/v6/${api}/latest/USD`;
    fetchData(url)
        .then(data => {
            const fromRate = data.conversion_rates[fromCurrencySelectTag.value];
            const toRate = data.conversion_rates[toCurrencySelectTag.value];

            if (!fromRate || !toRate) {
                throw new Error("Invalid currency code selected.");
            }

            const perRate = (toRate / fromRate).toFixed(4);
            const convertedAmount = (amount * (toRate / fromRate)).toFixed(4);

            resultTag.style.color = "black";
            status.textContent = `1 ${fromCurrencySelectTag.value} = ${perRate} ${toCurrencySelectTag.value}`;
            resultTag.textContent = `${amount} ${fromCurrencySelectTag.value} = ${convertedAmount} ${toCurrencySelectTag.value}`;

            btn.disabled = false;
            btn.style.color = "black";
            btn.style.cursor = "pointer";
            btn.textContent = "Convert";
        })
        .catch(error => {
            resultTag.style.color = "red";
            resultTag.textContent = `Error: ${error.message}`;
            status.textContent = "";
            btn.disabled = false;
            btn.style.color = "black";
            btn.style.cursor = "pointer";
            btn.textContent = "Convert";
            console.error("Additional information about error:", error);
        });
}

// Fetch API Data
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        return data;
    } catch (error) {
        resultTag.style.color = "red";
        resultTag.textContent = `Fetch API Error: ${error.message}`;
        throw error;
    }
}