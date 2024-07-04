// Expectation to the task:
//
// 1. There are no timed rate limits
//
// 2. Using both minPrice and maxPrice in the call will return all products at once (as per rule #5)
import axios from "axios";
// ^ Using axios library for API calls. 

const endpoint: string = "https://api.ecommerce.com/products";

// Provided global minimum and maximum prices
const globalMinPrice = 0;
const globalMaxPrice = 100_000;

type apiGet = {
  total: number,
  count: number,
  products: Object[]
}

interface apiParams {
  minPrice?: number;
  maxPrice?: number;
}

// Reading API with optional params
// Expected behavior: API call can return
// more than 1000 products if both 
// minPrice and maxPrice are used
async function readAPI(vars: apiParams = {}): Promise<apiGet> {
  let data: apiGet = (await axios.get(endpoint, { params: vars })).data;
  return data;
}

async function readEntireAPI(): Promise<Object[]> {
  const allProducts: Object[] = (await readAPI({ minPrice: globalMinPrice, maxPrice: globalMaxPrice })).products;
  return allProducts;
}

readEntireAPI().then((value) => console.log(value));
