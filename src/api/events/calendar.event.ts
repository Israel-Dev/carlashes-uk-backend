import events from 'events'
import { IEvents } from '../../utils/interfaces'

const { SEND_GRID_API_KEY, SEND_GRID_TO_EMAIL, SEND_GRID_FROM_EMAIL, WEBSITE } = process.env

const calendarEvents = new events()

const eventList = {
    newEventRequest: (eventData: IEvents) => calendarEvents.emit("New valid event request", eventData),
    newEventConfirmed: () => calendarEvents.emit("New event confirmed")
}

calendarEvents.on('New valid event request', async (eventData: IEvents) => {

})

calendarEvents.on('New event confirmed', () => {
    // Send email to client confirming session
    console.log("The event listenner")
})

export default eventList