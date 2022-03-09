import fs from "fs";
import axios from "axios";
import path from "path";
import { TOKEN_PATH, authorize } from "../../config/g.calendar";
import TreatmentService from "../services/treatment.service";
import PurchaseService from "./purchase.service";
import PendingEventModel from "../models/pending-event.model";

const { GOOGLE_CALENDAR_API_URL, CALENDAR_ID, GOOGLE_CALENDAR_CREDS } =
  process.env;

interface ITokenFile {
  access_token?: string;
  refresh_token?: string;
  scope?: string;
  token_type?: string;
  expiry_date?: number;
}

class CalendarService {
  tokenString = "";
  tokenFile: ITokenFile = {};

  constructor() {
    try {
      this.tokenFile = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf8"));

      this.tokenString = `${this.tokenFile.token_type} ${this.tokenFile.access_token}`;
    } catch (e: any) {
      console.error(e.message);

      authorize(JSON.parse(`${GOOGLE_CALENDAR_CREDS}`), (response: any) => {
        const { credentials } = response;

        this.tokenFile = credentials;
        this.tokenString = `${credentials.token_type} ${credentials.access_token}`;
      });
    }
  }

  rewriteLocalToken(newToken: any) {
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(newToken));
  }

  async isValidToken() {
    try {
      const localTokenJSON = this.tokenFile;

      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${localTokenJSON.access_token}`
      );

      if (response.status === 200) return true;
    } catch (e: any) {
      console.error(
        "Google token validation returned with code:",
        e.response.status
      );
      return false;
    }
  }

  async refreshToken() {
    try {
      const localTokenJSON = this.tokenFile;

      const credentials = JSON.parse(`${GOOGLE_CALENDAR_CREDS}`).installed;

      const response = await axios.post(`https://oauth2.googleapis.com/token`, {
        client_id: credentials.client_id,
        client_secret: credentials.client_secret,
        grant_type: "refresh_token",
        refresh_token: localTokenJSON.refresh_token,
      });

      if (response.status === 200) {
        localTokenJSON.access_token = response.data.access_token;

        this.rewriteLocalToken(localTokenJSON);
        this.tokenString = `${this.tokenFile.token_type} ${this.tokenFile.access_token}`;
      }
    } catch (e) {
      console.log("hey i just meet you");
      console.error(e);
    }
  }

  async getCalendars() {
    if (!(await this.isValidToken())) {
      console.error("The current Token isn't valid, fetching a new one...");
      await this.refreshToken();
    }

    const calendars = (
      await axios.get(`${GOOGLE_CALENDAR_API_URL}/users/me/calendarList`, {
        headers: { Authorization: this.tokenString },
      })
    )?.data;

    return calendars;
  }

  async getEvents() {
    if (!(await this.isValidToken())) {
      console.error("The current Token isn't valid, fetching a new one...");
      await this.refreshToken();
    }

    const events = (
      await axios.get(
        `${GOOGLE_CALENDAR_API_URL}/calendars/${CALENDAR_ID}/events?maxResults=2500&orderby=updated`,
        {
          headers: { Authorization: this.tokenString },
        }
      )
    )?.data;

    return events;
  }

  async getTreatments() {
    const treatments = (await TreatmentService.getAllTreatments()).map(
      (treatment: any) => {
        const formated = treatment.toJSON();
        delete formated._id;

        return formated;
      }
    );

    return treatments;
  }

  async getPendigEvent(eventRef: string) {
    try {
      const event = await PendingEventModel.findOne({ ref: eventRef }).exec();
      return event;
    } catch (e) {
      console.error(e);
    }
  }

  isSameDate(oldEventDate: string, newEventDate: string) {
    return oldEventDate.includes(newEventDate);
  }

  async isAvailable(startDateTime: string | Date, endDateTime: string | Date) {
    if (!(await this.isValidToken())) {
      console.error("The current Token isn't valid, fetching a new one...");
      await this.refreshToken();
    }

    const events = (await this.getEvents())?.items;

    const newStart = new Date(startDateTime);
    const newStartDate = newStart.toLocaleDateString("en-GB");
    const newStartTime = newStart.toLocaleTimeString("en-GB");

    const newEnd = new Date(endDateTime);

    const matchingEvent = events.find(
      (event: { start: { dateTime: string }; end: { dateTime: string } }) => {
        const oldStart = new Date(event.start.dateTime);
        const oldStartDate = oldStart.toLocaleDateString("en-GB");
        const oldStartTime = oldStart.toLocaleTimeString("en-GB");

        const oldEnd = new Date(event.end.dateTime);

        if (
          (this.isSameDate(oldStartDate, newStartDate) &&
            oldStartTime === newStartTime) ||
          (this.isSameDate(oldStartDate, newStartDate) &&
            // Starts before and old event but it extends itself until after the old event has started
            newStart < oldStart &&
            newEnd > oldStart) ||
          (this.isSameDate(oldStartDate, newStartDate) &&
            // Starts after the begginng of an old event and before the end of the same old event
            newStart > oldStart &&
            newStart < oldEnd)
        ) {
          return true;
        }
      }
    );

    if (!matchingEvent) return true;
  }

  async requestEvent(
    FStartDate: Date,
    FEndDate: Date,
    treatmentRef: string,
    clientName: string,
    email: string,
    phoneNumber: string,
    eventRef: string
  ) {
    try {
      const requestedTreatment = await TreatmentService.getOneTreatment(
        treatmentRef
      );

      if (requestedTreatment) {
        const bookingSessionID = await PurchaseService.createBookingSession(
          {
            name: requestedTreatment.name,
            schedulePrice: requestedTreatment.toJSON().schedulePrice,
          },
          eventRef,
          clientName
        );

        // Store the event request on db only after payment made
        const newEventReq = new PendingEventModel({
          ref: eventRef,
          startDate: FStartDate,
          endDate: FEndDate,
          treatment: { _id: requestedTreatment?._id },
          clientName: clientName,
          email: email,
          phoneNumber: phoneNumber,
          isPaid: false,
          stripeSessionId: bookingSessionID,
        });

        await newEventReq.save();
        return bookingSessionID;
      }
    } catch (error) {
      console.error(error);
    }
  }

  async insertEvent(
    start: string | Date,
    end: string | Date,
    details: {
      clientName: string;
      phoneNumber: string;
      email: string;
      treatmentName: string;
    }
  ) {
    if (!(await this.isValidToken())) {
      console.error("The current Token isn't valid, fetching a new one...");
      await this.refreshToken();
    }

    const response = await axios.post(
      `${GOOGLE_CALENDAR_API_URL}/calendars/${CALENDAR_ID}/events`,
      {
        start: {
          dateTime: new Date(start),
        },
        end: {
          dateTime: new Date(end),
        },
        summary: `${details.clientName} | ${details.treatmentName}`,
        description: `Phone Number: ${details.phoneNumber} | Email: ${details.email}
                `,
      },
      {
        headers: { Authorization: this.tokenString },
      }
    );

    if (response.status === 200) return;

    throw new Error(
      JSON.stringify({
        code: response.status,
        message: "It wasn't possible to schedule appointment",
      })
    );
  }

  async deletePendingEvent(event_ref: string) {
    try {
      await PendingEventModel.findOneAndDelete({ ref: event_ref }).exec();
      return true;
    } catch (e) {
      console.error(e);
    }
  }
}

export default new CalendarService();
