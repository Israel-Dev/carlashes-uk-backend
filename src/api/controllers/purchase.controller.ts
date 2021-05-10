import { Request, Response } from 'express'
import PurchaseService from '../services/purchase.service'
import EmailService from '../services/email.service'
import OrderService from '../services/order.service'
import ProductService from '../services/product.service'

const controller = {
    getSession: async (req: Request, res: Response) => {
        try {
            const { products, shippingMethod } = req.body

            const sessionID = await PurchaseService.createSession(products, shippingMethod)
            res.send({ sessionID })
        } catch (e) {
            console.error(e)
            res.status(500).send()
        }
    },
    confirmPayment: async (req: Request, res: Response) => {
        try {
            const { order_ref } = req.body

            const isPaid = await PurchaseService.isPaid(order_ref as string)

            const order: any = await OrderService.getOneOrder(order_ref as string)

            const products = await ProductService.getProductsById(order?.products)

            if (isPaid) {
                await EmailService.sendPaymentConfirmation(
                    {
                        clientEmail: order.clientEmail as string, 
                        orderRef: order.orderRef as string,
                        orderTotalPrice: Number(order.toJSON().totalPrice).toFixed(2),
                        products: products as any[]
                    }
                )
                res.status(200).send({message: "Your payment was sucessfull, you'll receive a confimation email in a couple of minutes, it may reach the spam inbox in some emails"})
            }

        } catch (e) {
            console.error(e)
            res.status(500).send()
        }
    }
}

export default controller