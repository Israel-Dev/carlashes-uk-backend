import { Decimal128, ObjectId } from 'mongodb'
import { Schema } from 'mongoose'
import { nanoid } from 'nanoid'
import mongoose from '../../config/db/connection'

const orderSchema = new Schema(
    {
        orderRef: {
            type: String,
            default: nanoid(),
            required: true
        },
        totalPrice: {
            type: Decimal128,
            required: true
        },
        products: {
            type: [ {id: ObjectId, quantity: Number} ],
            required: true
        },
        stripeSessionId: {
            type: String,
            required: false
        },
        clientEmail: {
            type: String,
            required: false
        }
    },
    {
        collection: "orders"
    }
)

orderSchema.set('toJSON', {
    transform: (doc: any, ret: any) => {
        ret.totalPrice = ret.totalPrice.toString()
        return ret
    }
})

const Order = mongoose.model('Order', orderSchema)

export default Order