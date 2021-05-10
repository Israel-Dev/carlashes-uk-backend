import { Request, Response } from 'express'

const middlewares = {
    hasProductRef: (req: Request, res: Response, next: Function) => {
        const { productRef } = req.query

        if (!productRef) return res.status(400).send({ message: "No product ref sent" })

        next()
    }
}

export default middlewares