"use strict";

const balance = document.getElementById('balance');
const money_plus = document.getElementById('money-plus');
const money_minus = document.getElementById('money-minus');
const list = document.getElementById('list');
const form = document.getElementById('form');
const text = document.getElementById('text');
const amount = document.getElementById('amount');
const date=document.getElementById('date');

// create a localStorageTransactions using JSON.parse for trasnactions
const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));

// If there are transactions in localStorage, set it to transactions, else set it to an empty array

let transactions = 
  localStorage.getItem('transactions') !== null ? localStorageTransactions : [];

/**
 * Generates a unique ID for the transaction. 
 * @returns number that represents a unique ID
 */
function generateID(){
  return new Date().getTime();
}

/**

 * @param {Event} e 
 */
function addTransaction(e) {
  
  e.preventDefault();

  if(text.value.trim() === '' || amount.value.trim() === '' || date.value.trim() === '') {
    alert('Please add Transaction Name,Amount and Date');
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value,
      date: date.value
    };
    console.log(transaction.date)
    //push transaction to transactions array
    transactions.push(transaction);

    // Add transaction to the DOM
    addTransactionDOM(transaction);

    // Update values of the Budget container
    updateValues();

    // Sets the transaction in user's localStorage so data persists
    updateLocalStorage();

    // Clear the input fields
    text.value = '';
    amount.value = '';
    date.value='';
  }

}


/**
 * @param {*} transaction the amount of transaction (e.g, 20 or -10)
 */
function addTransactionDOM(transaction){
  const sign = transaction.amount < 0 ? '-' : '+';

  
  // Create a list item 
  const item = document.createElement('li');

  // Add class based on amount
  item.classList.add(transaction.amount < 0 ? 'minus' : 'plus');

  
  item.innerHTML =  `
    <span class='todate'>${transaction.date} </span><span class='totext'>${transaction.text}</span> <span> ${sign}${Math.abs(transaction.amount)}</span> 
    <button class="delete-btn" onclick="removeTransaction(${transaction.id})">X</button></li>
  `;


  list.appendChild(item);
}


/**
 * Update the budget by calculating the balance, income, and expenses.
 */
function updateValues() {
  // Loop through the transactions array and create a new array with only amounts
  const amounts = transactions.map(transaction => 
    transaction.amount);

  // Reduce the array of amounts to a total, also set it to two decimal points
  const total = amounts
    .reduce((acc, val) => (acc += val), 0)
    .toFixed(2);
  
  // Get the income
  const income = amounts
    .filter((transaction) => transaction > 0)
    .reduce((acc, val) => (acc += val), 0)
    .toFixed(2);

  const expense = amounts
    .filter((transaction) => transaction < 0)
    .reduce((acc, val) => (acc += val), 0)
    .toFixed(2);

  balance.innerHTML = `₹${total}`;
  money_plus.innerHTML = `₹${income}`;
  money_minus.innerHTML = `₹${expense}`;
}

/**
 * @param {number} id 
 */
function removeTransaction(id){

  transactions = transactions.filter(transaction => transaction.id !== id);

  // Sets the transaction in user's localStorage so data persists
  updateLocalStorage();

  // Reinitialize app after removal to update data on the page
  init();
}


function updateLocalStorage(){
  localStorage.setItem('transactions', JSON.stringify(transactions));
}


 // Initializes the app with seed data (found in user's localStorage).
 
function init(){
  // Clear out the list
  list.innerHTML = ''; 

  // For each transactions, add it as a list item and to the DOM
  transactions.forEach(addTransactionDOM);
  updateValues();
}

// Initialize the app
init();

/* Event Listeners */
form.addEventListener('submit', addTransaction);