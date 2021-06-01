import express from 'express'
import controller from '../controllers/calendar.controller'
import mw from '../middlewares/calendar.middleware'

const router = express.Router()

router.get("/getCalendars", controller.getCalendars)
router.get("/getEvents", controller.getEvents)
router.get("/getTreatments", controller.getTreatments)
router.post("/payBooking", mw.hasAllFields, mw.isAvailable, controller.payBooking)
router.post("/requestEvent", mw.hasAllFields, mw.isAvailable, controller.requestEvent)
router.post('/confirmEvent', mw.hasEventRef, mw.isAvailable, controller.confirmEvent)
router.post("/insertEvent", mw.hasTimeFields, controller.insertEvent)


export default router