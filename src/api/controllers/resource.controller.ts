import { Request, Response } from "express";
import ResourceService from "../services/resource.service";
import TreatmentService from "../services/treatment.service";
import ProductService from "../services/product.service";

const controller = {
  getMenuOptions: async (req: Request, res: Response) => {
    try {
      const menuOptions = await ResourceService.getMenuOptions();

      res.send(menuOptions);
    } catch (e) {
      console.error(e);
      res.status(500).send();
    }
  },
  getMosaicOptions: async (req: Request, res: Response) => {
    try {
      const mosaicOptions = await ResourceService.getMosaicOptions();

      res.send(mosaicOptions);
    } catch (e) {
      console.error(e);
      res.status(500).send();
    }
  },
  getProductData: async (req: Request, res: Response) => {
    try {
      const { productRef } = req.query;

      let productData = await ResourceService.getProductData(
        productRef as string
      );

      if (!productData)
        productData = await ResourceService.getLashProductData(
          productRef as string
        );

      if (!productData) {
        return res.status(404).send({ message: "The product was not found" });
      }

      res.send(productData);
    } catch (e) {
      console.error(e);
      res.status(500).send();
    }
  },
  getRecommendations: async (req: Request, res: Response) => {
    try {
      const { productRef } = req.query;

      const recomendations = await ResourceService.getRecommendations(
        productRef as string
      );

      res.send(recomendations);
    } catch (e) {
      console.error(e);
      res.status(500).send();
    }
  },
  getTreatments: async (req: Request, res: Response) => {
    try {
      const treatments = (await TreatmentService.getAllTreatments()).map(
        (el: any) => {
          const json = el.toJSON();
          delete json._id;

          return json;
        }
      );

      res.send(treatments);
    } catch (e) {
      console.error(e);
    }
  },
  getTreatmentData: async (req: Request, res: Response) => {
    try {
      const { treatmentRef } = req.query;
      const treatmentData = await TreatmentService.getOneTreatment(
        treatmentRef as string
      );

      if (!treatmentData)
        return res.status(404).send({ message: "The treatment was not found" });

      res.send(treatmentData);
    } catch (e) {
      console.error(e);
    }
  },
  getTreatmentSubTypeImages: async (req: Request, res: Response) => {
    try {
      const { treatmentRef, subTypeRef } = req.query;

      const subTypeImages = await TreatmentService.getTreatmentSubTypeImages(
        treatmentRef as string,
        subTypeRef as string
      );

      if (!subTypeImages || !subTypeImages.length)
        return res.status(404).send({
          message: "No images were found for the seleced Treatment SubType",
        });

      res.send(subTypeImages);
    } catch (e) {
      console.error(e);
    }
  },
  getLashesProducts: async (req: Request, res: Response) => {
    try {
      const lashProducts = await ProductService.getLashesProducts();
      res.send(lashProducts);
    } catch (e) {
      console.error("Error in getLashesProducts:", e);
      res.status(500).send();
    }
  },
};

export default controller;
