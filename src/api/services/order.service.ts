import { nanoid } from 'nanoid'
import orderModel from "../models/order.model";
import { IProduct } from './purchase.service'

class OrderService {
    async getOneOrder(ref: string) {
        try {
            const order = await orderModel.findOne({orderRef: ref}).exec()
            return order
        } catch(e) {
            console.error(e)
        }
    }

    async createOrder(productsArr: IProduct[]) : Promise<any> {
        try {
            const ref = nanoid()
            const oldOrder = await this.getOneOrder(ref)
            
            if (oldOrder) {
                console.log("OrderService.createOrder -> Repeated Ref")
                return await this.createOrder(productsArr)
            }

            let totalPrice = 0

            for (let i=0; i < productsArr.length; i++) {
                const product = productsArr[i]
                totalPrice = totalPrice + (Number(product.toJSON().price) * product._doc.quantity)
            }

            const newOrder = await orderModel.create(
                {
                    orderRef: ref,
                    products: productsArr,
                    totalPrice
                }
            )

            return newOrder
        } catch(e) {
            console.error(e)
        }
    }
}

export default new OrderService()