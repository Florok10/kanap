const itemsTag = document.getElementById('items');

/**
 * Fetch the products from our back-end api
 * @returns array
 */
const fetchProducts = async () => {
  const response = await fetch('http://localhost:3000/api/products');
  return response.json();
};

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
