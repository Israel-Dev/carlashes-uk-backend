import { Request, Response } from 'express'
import CalendarService from '../services/calendar.service'

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
            return res.status(400).send({message: "There are fields missing"})
        }

        next()
    },
    isAvailable: async (req: Request, res: Response, next: Function) => {
        try {
            const { startDate, endDate } = req.body

            const isAvailable = await CalendarService.isAvailable(startDate, endDate)

            if (!isAvailable) {
                console.error("Request made of unavaible time frame")
                return res.status(403).send({message: "The choosen time frame is not available"})
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

            if (!event_ref) return res.status(400).send({message: "No event ref was sent"})

            next()
        } catch(e) {
            console.error(e)
            res.status(500).send()
        }
    }
}

export default middlewares