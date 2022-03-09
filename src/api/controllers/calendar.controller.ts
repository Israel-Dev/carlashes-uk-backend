import { Request, Response } from "express";
import CalendarService from "../services/calendar.service";
import EmailService from "../services/email.service";
import { nanoid } from "nanoid";
import TreatmentService from "../services/treatment.service";

const controller = {
  getCalendars: async (req: Request, res: Response) => {
    try {
      const calendars = await CalendarService.getCalendars();

      res.send(calendars);
    } catch (e) {
      console.error(e);
      res.status(500).send();
    }
  },
  getEvents: async (req: Request, res: Response) => {
    try {
      const events = await CalendarService.getEvents();

      res.send(events);
    } catch (e) {
      console.error(e);
      res.status(500).send();
    }
  },
  getTreatments: async (req: Request, res: Response) => {
    try {
      const treatments = await CalendarService.getTreatments();
      res.send(treatments);
    } catch (e) {
      console.error(e);
      res.status(500).send();
    }
  },
  payBooking: async (req: Request, res: Response) => {
    try {
      const { startDate, endDate, treatment, clientName, email, phoneNumber } =
        req.body;

      const eventRef = nanoid();
      const FStartDate = new Date(startDate);
      const FEndDate = new Date(endDate);

      const sessionID = await CalendarService.requestEvent(
        FStartDate,
        FEndDate,
        treatment,
        clientName,
        email,
        phoneNumber,
        eventRef
      );

      res.send({ sessionID });
    } catch (e) {
      console.error(e);
      res.status(500).send();
    }
  },
  requestBooking: async (req: Request, res: Response) => {
    try {
      const { event_ref } = req.body;

      const event = await CalendarService.getPendigEvent(event_ref);

      if (!event)
        return res
          .status(404)
          .send({ message: "The appointment was not found" });

      const FStartDate = new Date(event.startDate);
      const FEndDate = new Date(event.endDate);
      const clientName = event.clientName;
      const phoneNumber = event.phoneNumber;
      const email = event.email;
      const treatment = (
        await TreatmentService.getOneTreatmentById(event.treatment[0]._id)
      )?.name;

      if (treatment) {
        await EmailService.sendEventRequest(
          FStartDate,
          FEndDate,
          treatment,
          clientName,
          email,
          phoneNumber,
          event_ref
        );
        await EmailService.sendRequestToClient(
          FStartDate,
          FEndDate,
          treatment,
          clientName,
          email
        );

        res.status(201).send({
          message:
            "You'll be contacted by email or phone number confirming the appointment",
        });
      }
    } catch (e) {
      console.error(e);
      res.status(500).send();
    }
  },
  confirmEvent: async (req: Request, res: Response) => {
    try {
      const { event_ref } = req.body;

      const event: any = await CalendarService.getPendigEvent(event_ref);

      if (!event)
        return res.status(404).send({
          message: "The appointment you want to confirm was not found",
        });

      const FStartDate = new Date(event?.startDate);
      const FEndDate = new Date(event?.endDate);

      const isAvailable = await CalendarService.isAvailable(
        FStartDate,
        FEndDate
      );

      if (!isAvailable)
        return res
          .status(403)
          .send({ message: "Already have an appointment at that time" });

      const treatment: any = await TreatmentService.getOneTreatmentById(
        event.treatment[0]._id
      );

      const appointmentDetails = {
        clientName: event?.clientName,
        phoneNumber: event?.phoneNumber,
        email: event?.email,
        treatmentName: treatment?.name,
      };

      await CalendarService.insertEvent(
        FStartDate,
        FEndDate,
        appointmentDetails
      );

      await EmailService.sendEventConfirmation(
        FStartDate,
        FEndDate,
        appointmentDetails
      );

      res.status(200).send({
        title: "Success",
        message: "The appointment is confirmed",
      });

      await CalendarService.deletePendingEvent(event_ref);
    } catch (e) {
      console.error(e);
      res.status(500).send();
    }
  },
  insertEvent: async (req: Request, res: Response) => {
    try {
      const { startTime, endTime } = req.body;

      const isAvailable = await CalendarService.isAvailable(startTime, endTime);

      if (!isAvailable)
        return res
          .status(403)
          .send({ message: "Already have an appointment at that time" });

      // await CalendarService.insertEvent(startTime, endTime)

      res.send();
    } catch (e) {
      console.error(e);
      res.status(500).send();
    }
  },
  cancelEvent: async (req: Request, res: Response) => {
    try {
      const { event_ref } = req.body;

      const isDeleted = await CalendarService.deletePendingEvent(event_ref);

      if (isDeleted) {
        return res.status(202).send({
          title: `Cancelled`,
          message: "Your booking was cancelled",
        });
      } else {
        console.error(
          `The pending-event "${event_ref}" wasn't deleted due to an unkown reason`
        );
        return res.send();
      }
    } catch (e) {
      console.error(e);
    }
  },
};

export default controller;
