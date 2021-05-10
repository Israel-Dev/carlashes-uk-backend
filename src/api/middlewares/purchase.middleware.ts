import { Request, Response } from 'express'

const middlewares = {
    hasAllFields: (req: Request, res: Response, next: Function) => {
        const { products, shippingMethod } = req.body

        if (!products.length || !shippingMethod) return res.status(400).send({ message: "No products sent or shipping method choosen" })

        next()
    }
}

export default middlewares