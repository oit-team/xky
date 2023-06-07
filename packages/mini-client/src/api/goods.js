import { post } from './index'

export function getProducts(params) {
  return post('goods/product/getProducts', params)
}
