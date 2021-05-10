import { Decimal128 } from 'mongodb'
import mongoose from '../../config/db/connection'

const { Schema } = mongoose

const treatmentSchema = new Schema(
    {
        name: String,
        price: Decimal128,
        ref: String
    },
    {
        collection: "treatments"
    }
)

treatmentSchema.set('toJSON', {
    transform: (doc: any, ret: any) => {
        ret.price = ret.price.toString()
        return ret
    }
})

const Treatment = mongoose.model('Treatment', treatmentSchema)

export default Treatment