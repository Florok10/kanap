const imgTag = document.getElementsByClassName('item__img')[0];
const titleTag = document.getElementById('title');
const priceTag = document.getElementById('price');
const descriptionTag = document.getElementById('description');
const selectColorsTag = document.getElementById('colors');
const quantityTag = document.getElementById('quantity');
const addButtonTag = document.getElementById('addToCart');

const storage = localStorage;
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const productId = urlParams.get('id');

const getProduct = async (id) => {
  const response = await fetch(`http://localhost:3000/api/products/${id}`);
  return response.json();
};

getProduct(productId).then((product) => {
  document.title = product.name;
  imgTag.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}" >`;
  titleTag.innerHTML = product.name;
  priceTag.innerHTML = product.price;
  descriptionTag.innerHTML = product.description;
  product.colors.forEach((color) => {
    selectColorsTag.innerHTML += `<option value="${color}">${color}</option>`;
  });
});

const addItem = (quantity, colors) => {
  if (!colors) return alert('Une couleur doit être fournie');
  const _quantity = parseInt(quantity, 10);
  let cart = JSON.parse(storage.getItem('cart')) || [];

  const product =
    cart.find((item) => item.id === productId && item.colors === colors) || {};

  if (!product.id) product.id = productId;
  product.quantity = (product.quantity || 0) + _quantity;
  product.colors = colors;

  cart = cart.filter(
    (item) => !(item.id === productId && item.colors === colors)
  );
  const updatedCart = [...cart, product];
  storage.setItem('cart', JSON.stringify(updatedCart));
};

addButtonTag.addEventListener('click', (e) => {
  addItem(quantityTag.value, selectColorsTag.value);
});
