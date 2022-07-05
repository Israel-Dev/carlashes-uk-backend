import ProductService from "./product.service";

interface IProduct {
  name: string;
  productRef: string;
  menuPosition: number;
  mainImage: string;
}

class ResourceService {
  async getMenuOptions() {
    try {
      const products: any = await ProductService.getAllProducts();

      const filtered = products?.filter((product: IProduct) =>
        product.menuPosition ? true : false
      );

      filtered.sort((a: IProduct, b: IProduct) => {
        return a.menuPosition - b.menuPosition;
      });

      const menuOptions = filtered.map((product: IProduct) => ({
        name: product.name,
        url: `product?product_ref=${product.productRef}`,
      }));

      return menuOptions;
    } catch (e) {
      console.error(e);
    }
  }

  async getMosaicOptions() {
    try {
      const products: any = await ProductService.getAllProducts();

      const mosaicOptions = products?.map(
        (product: { mainImage: string; name: string; productRef: string }) => ({
          src: product.mainImage,
          alt: product.name,
          url: `product?product_ref=${product.productRef}`,
        })
      );

      return mosaicOptions;
    } catch (e) {
      console.error(e);
    }
  }

  async getProductData(productRef: string) {
    try {
      const product: any = await ProductService.getOneProduct(productRef);

      if (!product) return null;

      const images = product.images.map((image: string, i: number) => ({
        src: image,
        alt: `${product.name}-${i + 1}`,
      }));
      const { title, description } = product;
      const price = Number(product.toJSON().price);

      const productData = {
        title,
        description,
        price,
        productRef,
        images,
      };

      return productData;
    } catch (e) {
      console.error(e);
    }
  }

  async getLashProductData(productRef: string) {
    try {
      const product: any = await ProductService.getOneLashProduct(productRef);

      if (!product) return null;

      const images = product.images.map((image: string, i: number) => ({
        src: image,
        alt: `${product.name}-${i + 1}`,
      }));
      const { title, description } = product;
      const price = Number(product.toJSON().price);

      const productData = {
        title,
        description,
        price,
        productRef,
        images,
      };

      return productData;
    } catch (e) {
      console.error("Error in ResourceService.getLashProductData:", e);
    }
  }

  async getRecommendations(productRef: string) {
    try {
      const products: any = await ProductService.getAllProducts();

      const filtered = products?.filter((product: IProduct) =>
        product.productRef === productRef ? false : true
      );

      const recomendations = filtered.map((product: IProduct) => ({
        src: product.mainImage,
        alt: product.name,
        url: `product?product_ref=${product.productRef}`,
      }));
      return recomendations;
    } catch (e) {
      console.error(e);
    }
  }
}

export default new ResourceService();
