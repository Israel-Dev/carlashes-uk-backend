import express from 'express'
import controller from '../controllers/purchase.controller'
import mw from '../middlewares/purchase.middleware'

const router = express.Router()

router.post("/getSession", mw.hasAllFields, controller.getSession)
router.post("/confirmPayment", controller.confirmPayment)

export default router