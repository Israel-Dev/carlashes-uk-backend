import express from "express";
import cors from "cors";
import calendarRoute from "./api/routes/calendar.route";
import purchaseRoute from "./api/routes/purchase.route";
import resourceRoute from "./api/routes/resource.route";

const app = express();

const { PORT, WEBSITE, WHITELISTED_URLS } = process.env;

const whitelist = JSON.parse(WHITELISTED_URLS as string);

whitelist.push(WEBSITE as string);

const corsOptions = {
  origin: (origin: any, callback: Function) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));
app.use(express.json());

app.use("/calendar", calendarRoute);
app.use("/purchase", purchaseRoute);
app.use("/resource", resourceRoute);

//
app.get("/", (req, res) => {
  res.send("<h1>Carlashes-UK API</h1>");
});

app.listen(PORT, () => {
  console.log(`Node App listening on port: ${PORT}`);
});
