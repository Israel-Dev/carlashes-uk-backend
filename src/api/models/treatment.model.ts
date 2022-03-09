import { Decimal128 } from "mongodb";
import mongoose from "../../config/db/connection";

const { Schema } = mongoose;

interface Treatment extends mongoose.Document {
  name: string;
  price: string;
  ref: string;
  description: string;
  images: string[];
  teaser: string;
  schedulePrice: string;
  subTypes: {
    name: string;
    ref: string;
    price: string;
    mainImage: string;
    images: string[];
  }[];
}

const treatmentSchema = new Schema<Treatment>(
  {
    name: { type: String, required: true },
    price: { type: Decimal128, required: true },
    ref: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String], required: true },
    teaser: { type: String, required: true },
    schedulePrice: { type: Decimal128, required: true },
    subTypes: [
      {
        name: String,
        ref: String,
        price: Decimal128,
        mainImage: String,
        images: [String],
      },
    ],
  },
  {
    collection: "treatments",
  }
);

treatmentSchema.set("toJSON", {
  transform: (doc: any, ret: Treatment) => {
    ret.price = ret.price.toString();
    ret.schedulePrice = ret.schedulePrice.toString();
    ret.subTypes = ret.subTypes.map((subType) => ({
      ...subType,
      price: subType.price.toString(),
    }));
    return ret;
  },
});

const Treatment = mongoose.model<Treatment>("Treatment", treatmentSchema);

export default Treatment;
