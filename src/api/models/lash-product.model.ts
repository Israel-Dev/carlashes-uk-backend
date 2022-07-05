import mongoose from "../../config/db/connection";
import { Decimal128 } from "mongodb";

const { Schema } = mongoose;

const lashProductSchema = new Schema(
  {
    name: String,
    price: Decimal128,
    images: [String],
    productRef: String,
    description: String,
    mainImage: String,
  },
  {
    collection: "lashes-products",
  }
);

export interface ILashProduct {
  name: string;
  price: string;
  images: string[];
  productRef: string;
  description: string;
  mainImage: string;
}

lashProductSchema.set("toJSON", {
  transform: (doc: any, ret: any) => {
    ret.price = ret.price.toString();
    return ret;
  },
});

const LashProduct = mongoose.model("LashProduct", lashProductSchema);

export default LashProduct;
