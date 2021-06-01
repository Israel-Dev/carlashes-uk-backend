import { Request, Response } from 'express'
import CalendarService from '../services/calendar.service'
import PurchaseService from '../services/purchase.service'

const middlewares = {
    hasTimeFields: (req: Request, res: Response, next: Function) => {
        const { startTime, endTime } = req.body

        if (!startTime || !endTime) return res.status(400).send()
        next()
    },
    hasAllFields: (req: Request, res: Response, next: Function) => {
        const { startDate, endDate, treatment, clientName, email, phoneNumber } = req.body

        if (
            !startDate ||
            !endDate ||
            !treatment ||
            !clientName ||
            !email ||
            !phoneNumber
        ) {
            console.error("Missing fields in request")
            return res.status(400).send({ message: "There are fields missing" })
        }

        next()
    },
    isAvailable: async (req: Request, res: Response, next: Function) => {
        try {
            const { startDate, endDate } = req.body

            const isAvailable = await CalendarService.isAvailable(startDate, endDate)

            if (!isAvailable) {
                console.error("Request made of unavaible time frame")
                return res.status(403).send({ 
                    title: "Unavaible",
                    message: "The choosen time frame is not available"
                })
            }

            next()
        } catch (e) {
            console.error(e)
            res.status(500).send()
        }
    },
    hasEventRef: async (req: Request, res: Response, next: Function) => {
        try {
            const { event_ref } = req.body

            if (!event_ref) return res.status(400).send({ 
                title: "No Booking Reference",
                message: "No booking ref was not sent in request" 
            })

            next()
        } catch (e) {
            console.error(e)
            res.status(500).send()
        }
    },
    isPaid: async (req: Request | any, res: Response, next: Function) => {
        try {
            const { event_ref } = req.body

            const event = await CalendarService.getPendigEvent(event_ref)

            if (!event) return res.status(404).send({
                title: "Not found",
                message: "The desired booking wasn't found"
            })

            const isPaid = await PurchaseService.isPaidBooking(event.stripeSessionId)

            if (isPaid) {
                event.isPaid = true
                event.save()

                return next()
            }

            res.status(400).send({ 
                title: `Unpaid booking`,
                message: `You didn't pay for the desired booking` 
            })
        } catch (e) {
            console.error(e)
            res.status(400).send({ message: `An error occured` })
        }
    }
}

export default middlewares