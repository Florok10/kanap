const itemsTag = document.getElementById('items');

const getProducts = async () => {
  const response = await fetch('http://localhost:3000/api/products');
  return response.json();
};

getProducts()
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
