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
  owner: 'Ekene Udeozor',
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

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
const displayMovements = function(movements){
  containerMovements.innerHTML = '';
  movements.forEach(function(mov, i){
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1}</div>
      <div class="movements__date">3 days ago</div>
      <div class="movements__value">${mov}</div>
    </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}

// const euroToUSD = 1.1;
// const conversion = movements.map(function(mov){
//   return mov * euroToUSD;
// });
// console.log(conversion);
const createUserNames = function(accs){
  accs.forEach(function(acc){
    acc.username = acc.owner.toLowerCase()
    .split(' ')
    .map(name => name[0])
    .join('');
  });
}
createUserNames(accounts);
console.log(accounts);
const deposits = [];
for(const mov of movements){
  if(mov > 0){
    deposits.push(mov);
  }
}
const withdrawals = movements.filter(function(mov){
  return mov < 0;
})
// console.log(deposits);
// console.log(withdrawals);
const calcBalance = function(acc){
  const balance = acc.movements.reduce(function(acc, mov, i){
    return acc + mov;
  }, 0)
  acc.balance = balance;
  labelBalance.textContent = `${balance}€`;
}

const max = movements.reduce(function(acc, mov){
  if(acc > mov){
    return acc;
  }else return mov;
}, movements[0]);
console.log(max);

const calcDisplaySummary = function(movements){
  const income = movements.filter(function(mov){
    return mov > 0;
  }).
  reduce(function(acc, mov){
    return  acc + mov;
  }, 0);
  labelSumIn.textContent = `${income}€`;

  const expenditure = movements.filter(function(mov){
    return mov < 0;
  }).
  reduce(function(acc, mov){
    return  acc + mov;
  }, 0);
  labelSumOut.textContent = `${Math.abs(expenditure)}€`;
}


const firstWithdrawal = movements.find(function(mov){
  return mov < 0;
});
console.log(firstWithdrawal);

const updateUI = function(acc){
  displayMovements(acc.movements);
  calcDisplaySummary(acc.movements);
  calcBalance(acc);
}
//PREVENT FORM FROM SUBMITTING
let currentAccount;
btnLogin.addEventListener('click', function(e){
  e.preventDefault();
  currentAccount = accounts.find(function(acc){
    return acc.username === inputLoginUsername.value;
  });
    console.log(currentAccount);
    if(currentAccount?.pin === Number(inputLoginPin.value)){
      //Display UI and message
      labelWelcome.textContent = `Welcome back ${currentAccount.owner.split(' ')[0]}`;
      containerApp.style.opacity = 100;

      updateUI(currentAccount);

      inputLoginUsername.value = inputLoginPin.value = '';
      inputLoginPin.blur();
    }
})
//Implementing transfer function

btnTransfer.addEventListener('click', function(e){
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(function(acc){
    return acc.username === inputTransferTo.value;
  })
  console.log(amount, receiverAcc);
  if(amount > 0 && currentAccount.balance >= amount && receiverAcc.username !== currentAccount.username){
     console.log('Transfer valid');
     //Add amount to recipient
     receiverAcc.movements.push(amount);
     //Deduct from sender's balance
     currentAccount.movements.push(-amount);

     //Update the UI
     displayMovements(currentAccount.movements);
     calcDisplaySummary(currentAccount.movements);
     calcBalance(currentAccount);
     //remove values fr
     inputTransferTo.value = inputTransferAmount.value ='';
    }else{console.log('Invalid Transfer')};
})
btnClose.addEventListener('click', function(e){
  e.preventDefault();
  if(inputCloseUsername.value === currentAccount.username &&
  Number(inputClosePin.value) === currentAccount.pin){
    console.log('DELETED');
    labelWelcome.textContent = `We're sad to see you go ${currentAccount.owner.split(' ')[0]}☹ `
    //Delete Account
    const index = accounts.findIndex(function(acc){
      return acc.username === currentAccount.username;
    })
    console.log(index);
    accounts.splice(index, 1);
    //HIDE UI
    containerApp.style.opacity = 0;

  }
  inputClosePin.value = inputCloseUsername.value = '';
});
// const y= Array.from({length: 100}, () => Math.floor((Math.random() * 10) + 1));
// console.log(y);
