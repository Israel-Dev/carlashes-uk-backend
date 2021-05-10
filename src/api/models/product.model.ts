import { Decimal128 } from 'mongodb'
import { nanoid } from 'nanoid'
import mongoose from '../../config/db/connection'

const { Schema } = mongoose

const productSchema = new Schema(
    {
        name: String,
        title: String,
        price: Decimal128,
        images: [String],
        productRef: {
            type: String,
            default: nanoid(),
            required: true
        },
        description: String,
        mainImage: String,
        menuPosition: Number
    },
    {
        collection: "products"
    }
)

export interface IProduct {
    name: string,
    title: string,
    price: string,
    images: string[],
    productRef: string,
    description: string,
    mainImage: string
}

productSchema.set('toJSON', {
    transform: (doc: any, ret: any) => {
        ret.price = ret.price.toString()
        return ret
    }
})

const Product = mongoose.model('Product', productSchema)

export default Product