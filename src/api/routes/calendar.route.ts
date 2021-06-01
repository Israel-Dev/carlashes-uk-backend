import express from 'express'
import controller from '../controllers/calendar.controller'
import mw from '../middlewares/calendar.middleware'

const router = express.Router()

router.get("/getCalendars", controller.getCalendars)
router.get("/getEvents", controller.getEvents)
router.get("/getTreatments", controller.getTreatments)
router.post("/payBooking", mw.hasAllFields, mw.isAvailable, controller.payBooking)
router.post("/requestBooking", mw.isAvailable, mw.isPaid, controller.requestBooking)
router.post('/confirmBooking', mw.hasEventRef, mw.isAvailable, mw.isPaid, controller.confirmEvent)
router.delete('/cancelBooking', mw.hasEventRef, controller.cancelEvent)
router.post("/insertEvent", mw.hasTimeFields, controller.insertEvent)


export default router