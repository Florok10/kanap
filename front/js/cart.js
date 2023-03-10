const cartItemsTag = document.getElementById('cart__items');
const totalQuantityTag = document.getElementById('totalQuantity');
const totalPriceTag = document.getElementById('totalPrice');

const form = document.querySelector('form');

const submitBtn = document.getElementById('order');
const inputs = document.querySelectorAll('input[name]');

const UPDATE = 'UPDATE';
const DELETE = 'DELETE';

/**
 * Fetch the product with the given id
 * @param {string} id
 * @returns Promise<array | undefined>
 */
const fetchProduct = async (id) => {
  const response = await fetch(`http://localhost:3000/api/products/${id}`);
  return response.json();
};

/**
 * Attach an event listener to every input with a name
 */
inputs.forEach((input) => {
  input.addEventListener('input', () => {
    // Verify if all inputs are valid
    const allInputsAreValid = Array.from(inputs).every((input) =>
      verifyInputValue(input)
    );
    // If all inputs are not valid we disable the submit btn or activate it if they are valid
    if (allInputsAreValid) {
      submitBtn.disabled = false;
    } else {
      submitBtn.disabled = true;
    }
  });
});

/**
 * Use Regular Expressions to test the value of the input
 * @param {HTMLElement} input
 * @returns boolean
 */
function verifyInputValue(input) {
  const inputName = input.getAttribute('name');
  const inputValue = input.value;

  const nameRegex = /^[a-zA-Z-\s]{2,}$/;
  const emailRegex = /^^[\w\-\.]+@[\w-]+\.+[\w-]{2,4}$/;
  const cityRegex = /^[a-zA-Z\s-]{2,}$/;
  const addressRegex = /^([0-9]){1,}([a-zA-Z,-\s]){8,}/;

  const errorEl = document.querySelector(`#${inputName}ErrorMsg`);

  let test;
  let errorMsg;

  switch (inputName) {
    case 'firstName': {
      test = nameRegex.test(inputValue);
      errorMsg =
        'Le prénom ne doit pas comporter de chiffre ni de caractères spéciaux (!#@...) et être de deux caractères minimum.';
      break;
    }

    case 'lastName': {
      test = nameRegex.test(inputValue);
      errorMsg =
        'Le nom ne doit pas comporter de chiffre ni de caractères spéciaux (!#@...) et être de deux caractères minimum.';
      break;
    }

    case 'email': {
      test = emailRegex.test(inputValue);
      errorMsg = "L'adresse e-mail entrée n'est pas au bon format.";
      break;
    }

    case 'city': {
      test = cityRegex.test(inputValue);
      errorMsg =
        'Une ville ne doit pas comporter de chiffre ni de caractères spéciaux (!#@...) et être de deux caractères minimum.';
      break;
    }

    case 'address': {
      test = addressRegex.test(inputValue);
      errorMsg = "L'adresse doit compoter le numéro et le libellé de la voie.";
      break;
    }
  }

  errorEl.textContent = !test ? errorMsg : '';

  return test;
}

/**
 * Prevent the default behaviour of the submit and process the order
 * @param {Event} e
 */
form.addEventListener('submit', (e) => {
  order();
  e.preventDefault();
});

/**
 * Calculate and render the number of all the products in the cart
 * @param {[{id: string, colors: string, quantity: number | string}]} cart
 */
const renderTotalQuantity = (cart) => {
  totalQuantityTag.innerText = cart.reduce(
    (sum, item) => sum + parseInt(item.quantity, 10),
    0
  );
};

/**
 * Calculate and render the total of all products' price in the cart
 */
const renderTotalSum = () => {
  const pricesTags = document.querySelectorAll(`article .price`);
  let prices = [];
  for (let i = 0; i < pricesTags.length; i++) {
    prices.push(parseInt(pricesTags[i].textContent.match(/[0-9]+/)[0]), 10);
  }
  totalPriceTag.innerText = prices.reduce((sum, item) => sum + item, 0);
};

/**
 * Render both total of all products' price and  the number of all the products in the cart
 * @param {[{id: string, colors: string, quantity: number | string}]} cart
 */
const renderTotalAndQuantity = (cart) => {
  renderTotalQuantity(cart);
  renderTotalSum();
};

/**
 * Render the DOM for each change in the cart
 * @param {{action: string, product: {id: string, colors: string}, value: string}} param0
 */
const updateItems = async ({ action, product: { id, colors }, value }) => {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (!cart.length) throw new Error('The cart is empty');
  const product =
    cart[cart.findIndex((item) => item.id === id && item.colors === colors)];
  switch (action) {
    case UPDATE: {
      const quantityTag = document.querySelector(
        `article[data-id="${product.id}"][data-color="${product.colors}"] .cart__item__content__settings__quantity p`
      );
      const priceTag = document.querySelector(
        `article[data-id="${product.id}"][data-color="${product.colors}"] .price`
      );
      product.quantity = parseInt(value, 10);
      const fetchedProduct = await fetchProduct(product.id);

      priceTag.textContent = priceTag.textContent.replace(
        /[0-9]+/,
        fetchedProduct.price * product.quantity
      );
      quantityTag.textContent = quantityTag.textContent.replace(
        /[0-9]+/,
        product.quantity
      );
      localStorage.setItem('cart', JSON.stringify(cart));
      renderTotalAndQuantity(cart);
      break;
    }

    case DELETE: {
      cart = cart.filter((item) => !(item.id === id && item.colors === colors));
      localStorage.setItem('cart', JSON.stringify(cart));
      document
        .querySelector(`article[data-id="${id}"][data-color="${colors}"]`)
        .remove();
      renderTotalAndQuantity(cart);
      break;
    }
  }
};

/**
 * Do the initial render
 * @returns Promise<void>
 */
const render = async () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (!cart.length) return;
  for (let i = 0; i < cart.length; i++) {
    const item = cart[i];

    const fetchedProduct = await fetchProduct(item.id);
    const product = { ...fetchedProduct, ...item };

    cartItemsTag.innerHTML += `<article class="cart__item" data-id="${
      product.id
    }" data-color="${product.colors}">
			<div class="cart__item__img">
				<img src="${product.imageUrl}" alt="${product.altTxt}">
			</div>
			<div class="cart__item__content">
				<div class="cart__item__content__description">
					<h2>${product.name}</h2>
					<p>${product.colors}</p>
					<p class="price">${product.price * parseInt(product.quantity, 10)}&nbsp;€</p>
				</div>
				<div class="cart__item__content__settings">
					<div class="cart__item__content__settings__quantity">
						<p>Qté : ${product.quantity}</p>
						<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" onchange="updateItems({action: ${UPDATE}, product: {id: '${
      product.id
    }', colors: '${product.colors}'}, value: this.value})" value="${
      product.quantity
    }">
					</div>
					<div class="cart__item__content__settings__delete">
						<p class="deleteItem" onclick="updateItems({action: ${DELETE}, product: {id: '${
      product.id
    }', colors: '${product.colors}'}})">Supprimer</p>
					</div>
				</div>
			</div>
			</article>`;
  }
  renderTotalAndQuantity(cart);
};

render();

const order = async () => {
  debugger;
  const formData = new FormData(form);
  const contact = Object.fromEntries(formData.entries());
  console.log('contact', contact);
  //mettre les id produits dans un tableau
  const cart = JSON.parse(localStorage.getItem('cart')).map((item) => item.id);
  const options = {
    method: 'POST',
    body: JSON.stringify({ contact, products: cart }),
    headers: { 'Content-Type': 'application/json' },
  };
  const response = await fetch(
    'http://localhost:3000/api/products/order',
    options
  )
    .then((res) => res.json())
    .catch((err) => {
      throw new Error(err);
    });
  let path = window.location.href;
  path = path.replace(
    'cart.html',
    `confirmation.html?orderId=${response.orderId}`
  );
  window.location.replace(path);
};
