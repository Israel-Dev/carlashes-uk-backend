import { Model, Document } from "mongoose"
import ProductService from "./product.service"
import OrderService from "./order.service"

const { STRIPE_SECRET_KEY, WEBSITE } = process.env
const stripe = require('stripe')(STRIPE_SECRET_KEY as string)

export interface IProduct {
    images: string[]
    productRef: string
    _id: string
    name: string
    price: string
    description: string
    mainImage: string
    title: string
    quantity: number
    toJSON: Function
    _doc: {
        quantity: number
    }
}

class PurchaseService {
    async createSession(products: { ref: string, quantity: number }[], shippingMethod: number) {
        try {
            const productsArr: any = await ProductService.getProducts(products)

            const newOrder = await OrderService.createOrder(productsArr)

            const line_items = productsArr.map((product: IProduct) => {
                return (
                    {
                        price_data: {
                            currency: 'gbp',
                            product_data: {
                                name: product?.name,
                                images: product?.images,
                            },
                            unit_amount: Number(product.toJSON().price) * 100,
                        },
                        quantity: product._doc.quantity
                    }
                )
            })

            const shipping_line_item = {
                price_data: {
                    currency: 'gbp',
                    product_data: {
                        name: "DPD Next Working Day Tracked",
                    },
                    unit_amount: 300,
                },
                quantity: 1
            }

            if (shippingMethod === 2) {
                line_items.push(shipping_line_item)
            }

            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items,
                mode: 'payment',
                shipping_address_collection: {
                    allowed_countries: ["GB"]
                },
                success_url: `${WEBSITE}/purchase-confirmed?order_ref=${newOrder.orderRef}&success=true`,
                cancel_url: `${WEBSITE}/purchase-confirmed?order_ref=${newOrder.orderRef}&canceled=true`,
            })

            const sessionID = session.id
            newOrder.stripeSessionId = sessionID

            await newOrder.save()

            return sessionID
        } catch (e) {
            console.error(e)
            return null
        }

    }

    async isPaid(orderRef: string) {
        try {
            const order: any = await OrderService.getOneOrder(orderRef)

            const stripeSession = await stripe.checkout.sessions.retrieve(order.stripeSessionId)

            order.clientEmail = stripeSession.customer_details.email

            await order.save()

            if (stripeSession.payment_status === "paid") {
                return true
            }
        } catch (e) {
            console.error(e)
        }
    }
}

export default new PurchaseService()