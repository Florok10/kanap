/**
 * Fetch the products from our back-end api
 * @returns [{id: string, colors: [string], name: string, price: number, imageUrl: string, description: string, altTxt: string}]
 */
export const fetchProducts = async () => {
  const response = await fetch('http://localhost:3000/api/products');
  return response.json();
};

/**
 * Fetch the product with the given id
 * @param {string} id
 * @returns Promise<array | undefined>
 */
export const fetchProduct = async (id) => {
  const response = await fetch(`http://localhost:3000/api/products/${id}`);
  return response.json();
};
