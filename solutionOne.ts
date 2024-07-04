// Expectation to the task:
//
// 1. There are no timed rate limits
//
// 2. There are products with the duplicate prices
//    Example: product #1 has price of 5$ and product #5 has price of 5$
import axios from "axios";
// ^ Using axios library for API calls. 

const endpoint: string = "https://api.ecommerce.com/products";

// Expectation to the task:
// Each product has a price value
type product = {
  price: number
}
type apiGet = {
  total: number,
  count: number,
  products: product[]
}

interface apiParams {
  minPrice?: number;
  maxPrice?: number;
}

// Reading API with optional params
// Expected behavior: API call will always return 
// 1000 products no matter the parameters
//
// (issue in the task rules #5 saying that we can influence the max limit by using minPrice and maxPrice parameters, which conflicts with th rule #3)
async function readAPI(vars: apiParams = {}): Promise<apiGet> {
  let data: apiGet = (await axios.get(endpoint, { params: vars })).data;
  return data;
}

async function readEntireAPI(): Promise<product[]> {
  let lastLowestPrice: number = 0;
  const firstCall = (await readAPI({minPrice: lastLowestPrice}));
  // Expectation:
  // Total returns the total amount of products if price range is not specified
  const total = firstCall.total;
  let allProducts: product[] = firstCall.products;

  for (let i = 0; i < total;) {
    const response = await readAPI({minPrice: lastLowestPrice + 1});
    // Expectation: results are sorted from minimal to maximum price.
    // In case it's not it can be fixed by manually sorting response
    // Example of how it could be done: 
    // const response = (await readAPI({minPrice: lastLowestPrice})).products.sort((a, b) => a.price - b.price);

    allProducts.concat(response.products);
    // Recording last lowest price to use for the next cycle.
    lastLowestPrice = allProducts[allProducts.length - 1].price;
    i = allProducts.length;
  }
  return allProducts;
}

readEntireAPI().then((value) => console.log(value));
