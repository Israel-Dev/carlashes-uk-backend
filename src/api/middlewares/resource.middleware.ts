import { Request, Response } from "express";

const middlewares = {
  hasProductRef: (req: Request, res: Response, next: Function) => {
    const { productRef } = req.query;

    if (!productRef)
      return res.status(400).send({ message: "No product ref sent" });

    next();
  },
  hasTreatmentRef: (req: Request, res: Response, next: Function) => {
    const { treatmentRef } = req.query;

    if (!treatmentRef)
      return res.status(400).send({ message: "No treatment ref sent" });

    next();
  },
  hasTreatmentSubTypeRef: (req: Request, res: Response, next: Function) => {
    const { subTypeRef } = req.query;

    if (!subTypeRef) {
      return res.status(400).send({ message: "No treatment subtype ref sent" });
    }

    next();
  },
};

export default middlewares;
