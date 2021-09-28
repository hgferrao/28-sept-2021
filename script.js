'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = ''; //.textContent=0
  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1}${type}</div>
    <div class="movements__value">${mov} €</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

// displayMovements(account1.movements);
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => (acc += mov), 0);

  labelBalance.textContent = `${acc.balance} €`;
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => (acc += mov), 0);
  labelSumIn.textContent = `${incomes} €`;
  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => (acc += mov), 0);
  labelSumOut.textContent = `${Math.abs(out)} €`;
  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(depsit => (depsit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => (acc += int), 0);
  labelSumInterest.textContent = `${interest}€`;
};

const createUserName = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0]) //returning the first letter
      .join(''); // used join() to join the returned element
  });
};
createUserName(accounts);
// console.log(accounts);

const updateUI = function (acc) {
  //Display movements
  displayMovements(acc.movements);
  //Display balance
  calcDisplayBalance(acc);
  //Display summary
  calcDisplaySummary(acc);
};

//Event handler
let currentAccount;
btnLogin.addEventListener('click', function (e) {
  //prevent from submitting
  e.preventDefault();
  // console.log('login');
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  // console.log(currentAccount);
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    //Display UI and welcome message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;
    //Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
    //Update UI
    updateUI(currentAccount);
  }
});
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    //doing the transfer
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);
    //Update UI
    updateUI(currentAccount);
  }
});
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);
    //Update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';
});
btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    // console.log(index);
    //Delete account
    accounts.splice(index, 1);
    //Hide UI
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
// let arr = ['a', 'b', 'c', 'd', 'e'];
//slice
// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2));
// console.log(arr.slice(-1));
// console.log(arr.slice(1, -2));
// console.log(arr.slice()); //returns same arry
// console.log([...arr]);
// //splice
// // console.log(arr.splice(2));
// arr.splice(-1);
// console.log(arr); //the splice changes original arry splice deleted them
// arr.splice(1, 2); //it takes start index and no of elements to delete after that
// console.log(arr);

//Reverse
// let arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2);
// //Concat
// const letters = arr.concat(arr2);
// // console.log(...arr, ...arr2); //same as above result
// console.log(letters);

// //join
// console.log(letters.join('-'));

//for of loop
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// // for (const movement of movements)
// for (const [i, movement] of movements.entries()) {
//   if (movement > 0) {
//     console.log(`Movement ${i + 1}:You have deposited ${movement}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(movement)}`); //Math.abs to remove negative sign
//   }
// }
// console.log('-------FOREACH-------');
// //for each for above for of loop
// movements.forEach(function (mov, i, arr) {
//   if (mov > 0) {
//     console.log(`Movement ${i + 1}:You have deposited ${mov}`);
//   } else {
//     console.log(`Movement ${i + 1}: You withdrew ${Math.abs(mov)}`); //Math.abs to remove negative sign
//   }
// });
//0:function(200) //for Each works on each element in an array index
//1:function(450)
//2:function(400)

//ForEach on maps and sets
//MAP
// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);
// currencies.forEach(function (value, key, map) {
//   console.log(`${key}: ${value}`);
// });
// //SET
// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
// console.log(currenciesUnique);
// currenciesUnique.forEach(function (value, _, set) {
//   console.log(`${value}: ${value}`);
// });

//Challenge
// const checkDogs = function (dogsJulia, dogsKate) {
//   const dogsJuliaCorrected = dogsJulia.slice();
//   dogsJuliaCorrected.splice(0, 1); //removing first data
//   dogsJuliaCorrected.splice(-2); //removing last two data
//   //dogsJulia.slice(1, 3); // can use this method for above code
//   const dogs = dogsJuliaCorrected.concat(dogsKate);
//   console.log(dogs);
//   //"Dog number 1 is an adult, and 5 years old"
//   // or a Puppy ("Dog number 2 is still a puppy")
//   dogs.forEach(function (dog, i) {
//     if (dog >= 3) {
//       console.log(`Dog number ${i + 1} is an Adult, and ${dog} years old`);
//     } else {
//       console.log(`Dog number ${i + 1} is still a Puppy`);
//     }
//   });
// };
// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);

//The Map method
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const eurToUsd = 1.1;
// const movementsUSD = movements.map(function (mov) {
//   return mov * eurToUsd;
// });
// //Writing using arrow function
// // const movementsUSD = movements.map(mov => mov * eurToUsd);

// console.log(movements);
// console.log(movementsUSD);
// // same as above but using for of loop
// const movementsUDSfor = [];
// for (const mov of movements) {
//   movementsUDSfor.push(mov * eurToUsd);
// }
// console.log(movementsUDSfor);

// const movementsDescriptons = movements.map(
//   (mov, i) =>
//     `Movement ${i + 1}:You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(
//       mov
//     )}`
// );
// console.log(movementsDescriptons);

//Filter method
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const deposits = movements.filter(function (mov) {
//   return mov > 0;
// });

// console.log(movements);
// console.log(deposits);

// //using for of loop exercise
// const depositsfor = [];
// for (const mov of movements) {
//   if (mov > 0) depositsfor.push(mov);
// }
// console.log(depositsfor);
// //for withdrawal
// const withdrawalfor = movements.filter(mov => mov < 0);
// console.log(withdrawalfor);

//Reduce method
//Accumulator is like snow ball
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const balance = movements.reduce(function (acc, cur, i, arr) {
//   console.log(`Itertion no ${i} and value: ${acc}`);
//   return acc + cur;
// }, 0); //value of accumulaor set to zero
//above reduce method using arrow function
// const balance = movements.reduce((acc, cur) => acc + cur, 0);
// console.log(balance);

//using for loop
// let balance2 = 0;
// for (const mov of movements) balance2 += mov;
// console.log(balance2);

//Maximum value
// const max = movements.reduce((acc, mov) => {
//   if (acc > mov) return acc;
//   else return mov;
// }, movements[0]); //giving the first value of the array
// console.log(max);

//Coding challenge 2
// const calcAverageHumanAge = function (ages) {
//   const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
//   const adults = humanAges.filter(age => age >= 18);
//   const average = adults.reduce((acc, age) => (acc += age), 0) / adults.length;
//   return average;
//   // console.log(average);
//   // console.log(humanAges);
//   // console.log(adults);
// };
// const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
// console.log(avg1, avg2);

//Chaining the methods
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const eurToUsd = 1.1;
// const totalDepositedUSD = movements
//   .filter(mov => mov > 0)
//   .map(mov => mov * eurToUsd)
//   .reduce((acc, mov) => (acc += mov), 0);
// console.log(totalDepositedUSD);

//Coding challenge 3
// const calcAverageHumanAge = ages =>
//   ages
//     .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//     .filter(age => age >= 18)
//     .reduce((acc, age, i, arr) => acc + age / arr.length, 0);
// const avg1 = calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]);
// const avg2 = calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]);
// console.log(avg1, avg2);

// Find method
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(firstWithdrawal);
// console.log(accounts);
// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

//Some and every method
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// console.log(movements);
// console.log(movements.includes(-130)); //returns true //checks only for equality

// //Some method
// // checks for condition
// const anyDeposit = movements.some(mov => mov > 6000); //here it will check for value above specified condition
// console.log(anyDeposit); //retrns flase

//Every method
// const everyEx = movements.every(mov => mov > 0);
// console.log(everyEx);
// const everyEx2 = account4.movements.every(mov => mov > 0);
// console.log(everyEx2);

// //Seperate callback
// const deposit = mov => mov > 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

//Flat method
// const arr = [1, 2, [3, 4, 5], 6, 7, [8, 9], 10, [11, 12]];
// console.log(arr.flat());
// const arrDeep = [[[1, 2, [10, 11], 3], 4], 5, 6, [7, 8], 9];
// console.log(arrDeep.flat(3)); //3 value shows the depth of an array

// //joining all arrays in one of all accounts of project [Exercise]
// // const accountMovements = accounts.map(acc => acc.movements); //looping over all accounts and storing it in one variable
// // console.log(accountMovements);
// // const allMovements = accountMovements.flat();
// // console.log(allMovements);
// // //to check total
// // const overallBalance = allMovements.reduce((acc, mov) => acc + mov, 0);
// // console.log(overallBalance);
// Flat
// const overallBalance = accounts
//   .map(mov => mov.movements)
//   .flat()
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance);
// //FlatMap
// const overallBalance2 = accounts
//   .flatMap(mov => mov.movements)
//   .reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance2);

//Sorting
//With String
const owners = ['Jonas', 'Zach', 'Henry', 'Martha', 'Adam'];
console.log(owners.sort());
console.log(owners); //It mutates original arry
//With numbers
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
console.log(movements.sort()); //this will sort depending upon string

// return <0 A,B [Keep order]
// return >0 B,A [Switch order]
// movements.sort((a, b) => {
//   if (a > b) return 1;
//   if (a < b) return -1;
// });
movements.sort((a, b) => a - b);
console.log(movements); //will return arry with ascending order

// movements.sort((a, b) => {
//   if (a < b) return 1;
//   if (a > b) return -1;
// });
movements.sort((a, b) => b - a);
console.log(movements); //will return arry with descending order
