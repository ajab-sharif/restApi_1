// import singup from './signup';
console.log('hello');
// SELECT DOM ELEMENT 
const userList = document.querySelector('.user-list');
const userMessage = document.querySelector('.user-message');
const demyText = document.querySelector('.demy-text');
let hide = false;

const form = document.querySelector('.form-signup');
const btnSignUp = document.querySelector('.btn-signup');

console.log(form);
console.log(btnSignUp);

// if (form) {
//   console.log('form');
//   btnSignUp.addEventListener('submit', function (e) {
//     e.preventDefault();
//     console.log('...');
//   })
// }

if (form) {
  console.log('form');
  btnSignUp.addEventListener('submit', function (e) {
    e.preventDefault();

    const data = form.serialize();

    fetch('/api/submit', {
      method: 'POST',
      body: data
    });
  })
}

console.log('index.js');
userList.addEventListener('click', function (e) {
  if (hide) {
    demyText.classList.remove('hide');
    userMessage.classList.add('hide');
    hide = !hide
  } else {
    demyText.classList.add('hide');
    userMessage.classList.remove('hide');
    hide = !hide
  }
  console.log(hide);
})
