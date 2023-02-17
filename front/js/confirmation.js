const orderIdTag = document.getElementById('orderId');
const queryString = window.location.search;
const orderId = new URLSearchParams(queryString).get('orderId');

orderIdTag.textContent = orderId;
