import ProductModel, { IProduct } from "../models/product.model";
import LashProductModel from "../models/lash-product.model";

class ProductService {
  async getOneProduct(ref: string) {
    try {
      const product = await ProductModel.findOne({ productRef: ref }).exec();
      return product;
    } catch (e) {
      console.error(e);
    }
  }

  async getOneLashProduct(ref: string) {
    try {
      const product = await LashProductModel.findOne({
        productRef: ref,
      }).exec();
      return product;
    } catch (e) {
      console.error(e);
    }
  }

  async getAllProducts() {
    try {
      const products = await ProductModel.find({}).exec();
      return products;
    } catch (e) {
      console.error(e);
    }
  }

  async getProducts(products: { ref: string; quantity: number }[]) {
    try {
      const productsArr = [];

      for (let i = 0; i < products.length; i++) {
        const ref = products[i].ref;
        const product: any = await ProductModel.findOne({
          productRef: ref,
        }).exec();
        product._doc["quantity"] = products[i].quantity;
        productsArr.push(product);
      }

      return productsArr;
    } catch (e) {
      console.error(e);
    }
  }

  async getProductsById(products: { _id: string; quantity: number }[]) {
    try {
      const productsArr = [];

      for (let i = 0; i < products.length; i++) {
        const _id = products[i]._id;
        const product: any = await ProductModel.findOne({ _id: _id }).exec();
        product._doc["quantity"] = products[i].quantity;
        productsArr.push(product);
      }

      return productsArr;
    } catch (e) {
      console.error(e);
    }
  }

  async getLashesProducts() {
    try {
      const lashesProducts = await LashProductModel.find({}).exec();

      return lashesProducts;
    } catch (e) {
      console.error("Error in ProductService.getLashesProducts", e);
    }
  }
}

export default new ProductService();
