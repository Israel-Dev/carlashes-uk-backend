import {Request, Response} from 'express'
import ResourceService from '../services/resource.service'

const controller = {
    getMenuOptions: async (req: Request, res: Response) => {
        try {
            const menuOptions = await ResourceService.getMenuOptions()
            
            res.send(menuOptions)
        } catch (e) {
            console.error(e)
            res.status(500).send()
        }
    },
    getMosaicOptions: async (req: Request, res: Response) => {
        try {
            const mosaicOptions = await ResourceService.getMosaicOptions()

            res.send(mosaicOptions)
        } catch(e) {
            console.error(e)
            res.status(500).send()
        }
    },
    getProductData: async (req: Request, res: Response) => {
        try {
            const { productRef } = req.query

            const productData = await ResourceService.getProductData(productRef as string)

            if (!productData) return res.status(404).send({message: "The product was not found"})

            res.send(productData)
        } catch(e) {
            console.error(e)
            res.status(500).send()
        }
    },
    getRecommendations: async (req: Request, res: Response) => {
        try {
            const { productRef } = req.query

            const recomendations = await ResourceService.getRecommendations(productRef as string)

            res.send(recomendations)
        } catch(e) {
            console.error(e)
            res.status(500).send()
        }
    }
}

export default controller