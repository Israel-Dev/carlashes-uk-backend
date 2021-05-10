import express from 'express'
import controller from '../controllers/resource.controller'
import mw from '../middlewares/resource.middleware'

const router = express.Router()

router.get('/getMenuOptions', controller.getMenuOptions)
router.get('/getMosaicOptions', controller.getMosaicOptions)
router.get('/getProductData', mw.hasProductRef, controller.getProductData)
router.get('/getRecomendations', mw.hasProductRef, controller.getRecommendations)

export default router