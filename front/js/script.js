import { fetchProducts } from './api';

const itemsTag = document.getElementById('items');

/**
 * After fetching the products, render each product found in the DOM
 */
fetchProducts()
  .then((products) => {
    itemsTag.innerHTML = '';
    products.forEach((product) => {
      itemsTag.innerHTML += `<a href="./product.html?id=${product._id}">
																<article>
																	<img src="${product.imageUrl}" alt="${product.altTxt}">
																	<h3 class="productName">${product.name}</h3>
																	<p class="productDescription">${product.description}</p>
																</article>
															</a>`;
    });
  })
  .catch(console.error);
