import { nanoid } from "nanoid";
import mongoose from "../../config/db/connection";

const { Schema } = mongoose;

const pendingEventSchema = new Schema(
  {
    ref: {
      type: String,
      required: true,
      default: nanoid(),
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    treatment: {
      type: Array,
      default: [String],
      required: true,
    },
    clientName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    isPaid: Boolean,
    stripeSessionId: {
      type: String,
      required: false,
    },
    subTreatmentRef: {
      type: String,
      required: true,
    },
    treatmentType: {
      type: String,
      required: false,
    },
  },
  {
    collection: "pending-events",
  }
);

const PendingEvent = mongoose.model("PendingEvent", pendingEventSchema);

export default PendingEvent;
