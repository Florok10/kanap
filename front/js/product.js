const imgTag = document.getElementsByClassName('item__img')[0];
const titleTag = document.getElementById('title');
const priceTag = document.getElementById('price');
const descriptionTag = document.getElementById('description');
const selectColorsTag = document.getElementById('colors');
const quantityTag = document.getElementById('quantity');
const addButtonTag = document.getElementById('addToCart');

/**
 * Fetch the product with the given id
 * @param {string} id
 * @returns Promise<array | undefined>
 */
const fetchProduct = async (id) => {
  const response = await fetch(`http://localhost:3000/api/products/${id}`);
  return response.json();
};

const storage = localStorage;
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const productId = urlParams.get('id');

/**
 * After fetching the product, set the tags' content
 */
fetchProduct(productId)
  .then((product) => {
    document.title = product.name;
    imgTag.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}" >`;
    titleTag.textContent = product.name;
    priceTag.textContent = product.price;
    descriptionTag.textContent = product.description;
    product.colors.forEach((color) => {
      selectColorsTag.innerHTML += `<option value="${color}">${color}</option>`;
    });
  })
  .catch((err) => {
    console.error(err);
    document.querySelector('main').textContent = err;
  });

/**
 * Group the items in the given cart by their id
 * @param {[{id: string, colors: string, quantity: number | string}]} cart
 * @returns array
 */
const groupItems = (cart) => {
  const cartReduced = cart.reduce((group, item) => {
    const { id } = item;
    group[id] = group[id] ?? [];
    group[id].push(item);
    return group;
  }, {});
  return Object.values(cartReduced).reduce((arr, item) => arr.concat(item), []);
};

/**
 * Add an item to the cart
 * @param {string} quantity
 * @param {string} colors
 * @returns void
 */
const addItem = (quantity, colors) => {
  if (!colors) return alert('Une couleur doit être fournie');
  const _quantity = parseInt(quantity, 10);
  let cart = JSON.parse(storage.getItem('cart')) || [];

  const productIndex = cart.findIndex(
    (item) => item.id === productId && item.colors === colors
  );

  const product = cart[productIndex] || {};

  if (!product.id) product.id = productId;
  product.quantity = (product.quantity || 0) + _quantity;
  product.colors = colors;

  switch (productIndex) {
    case -1: {
      storage.setItem('cart', JSON.stringify(groupItems([...cart, product])));
      break;
    }
    default: {
      storage.setItem('cart', JSON.stringify(groupItems(cart)));
    }
  }
};

addButtonTag.addEventListener('click', (e) => {
  addItem(quantityTag.value, selectColorsTag.value);
});
