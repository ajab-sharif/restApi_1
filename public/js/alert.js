
const hideAlert = () => {
  const el = document.querySelector('.alert');
  if (el) el.parentElement.removeChild(el);
}
export const showAlert = function (type, message) {
  // type 'denger' or 'success'
  const markup = `<div class="alert alert-${type}" role="alert">${message}</div> `;
  document.querySelector('body').insertAdjacentHTML('afterbegin', markup);
  window.setTimeout(hideAlert, 3000);
}