const HOST = 'localhost';
const PORT = '3000';

/**
 * Fetch the products from our back-end api
 * @returns [{id: string, colors: [string], name: string, price: number, imageUrl: string, description: string, altTxt: string}]
 */
export const fetchProducts = async () => {
  const response = await fetch(`http://${HOST}:${PORT}/api/products`);
  return response.json();
};

/**
 * Fetch the product with the given id
 * @param {string} id
 * @returns Promise<array | undefined>
 */
export const fetchProduct = async (id) => {
  const response = await fetch(`http://${HOST}:${PORT}/api/products/${id}`);
  return response.json();
};

/**
 * Send a post request to order
 * @param {{contact: { firstName: string, lastName: string, adress: string, city: string, email: string},
 *  products: [{id: string, price: string, colors: [string]}]}} order
 * @returns Promise<object | undefined>
 */
export const postOrder = async (order) => {
  const response = await fetch(`http://${HOST}:${PORT}/api/order/`, {
    method: 'POST',
    body: JSON.stringify(order),
  });
  return response.json();
};
