import express from "express";
import controller from "../controllers/resource.controller";
import mw from "../middlewares/resource.middleware";

const router = express.Router();

router.get("/getMenuOptions", controller.getMenuOptions);
router.get("/getMosaicOptions", controller.getMosaicOptions);
router.get("/getProductData", mw.hasProductRef, controller.getProductData);
router.get("/getTreatments", controller.getTreatments);
router.get(
  "/getTreatmentData",
  mw.hasTreatmentRef,
  controller.getTreatmentData
);
router.get(
  "/getTreatmentSubTypeImages",
  mw.hasTreatmentRef,
  mw.hasTreatmentSubTypeRef,
  controller.getTreatmentSubTypeImages
);
router.get(
  "/getRecomendations",
  mw.hasProductRef,
  controller.getRecommendations
);
router.get("/lashesProducts", controller.getLashesProducts);

export default router;
