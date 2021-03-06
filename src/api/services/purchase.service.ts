// import { Model, Document } from "mongoose"
import ProductService from "./product.service";
import OrderService from "./order.service";
import TreatmentService from "./treatment.service";

const { STRIPE_SECRET_KEY, WEBSITE } = process.env;
const stripe = require("stripe")(STRIPE_SECRET_KEY as string);

export interface IProduct {
  images: string[];
  productRef: string;
  _id: string;
  name: string;
  price: string;
  description: string;
  mainImage: string;
  title: string;
  quantity: number;
  toJSON: Function;
  _doc: {
    quantity: number;
  };
}

class PurchaseService {
  async createSession(
    products: { ref: string; quantity: number }[],
    shippingMethod: number
  ) {
    try {
      const productsArr: any = await ProductService.getProducts(products);

      const newOrder = await OrderService.createOrder(productsArr);

      const line_items = productsArr.map((product: IProduct) => {
        return {
          price_data: {
            currency: "gbp",
            product_data: {
              name: product?.name,
              images: product?.images,
            },
            // In order to have only two decimals numbers
            unit_amount:
              Math.round(Number(product.toJSON().price) * 100 * 100) / 100,
          },
          quantity: product._doc.quantity,
        };
      });

      const shipping_line_item = {
        price_data: {
          currency: "gbp",
          product_data: {
            name: "DPD Next Working Day Tracked",
          },
          unit_amount: 300,
        },
        quantity: 1,
      };

      if (shippingMethod === 2) {
        line_items.push(shipping_line_item);
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items,
        mode: "payment",
        shipping_address_collection: {
          allowed_countries: ["GB"],
        },
        success_url: `${WEBSITE}/purchase-confirmed?order_ref=${newOrder.orderRef}&success=true`,
        cancel_url: `${WEBSITE}/purchase-confirmed?order_ref=${newOrder.orderRef}&canceled=true`,
      });

      const sessionID = session.id;
      newOrder.stripeSessionId = sessionID;

      await newOrder.save();

      return sessionID;
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  async isPaid(orderRef: string) {
    try {
      const order: any = await OrderService.getOneOrder(orderRef);

      const stripeSession = await stripe.checkout.sessions.retrieve(
        order.stripeSessionId
      );

      order.clientEmail = stripeSession.customer_details?.email;

      await order.save();

      if (stripeSession.payment_status === "paid") {
        return true;
      }
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async isPaidBooking(stripeSessionId: string) {
    try {
      if (!stripeSessionId) return false;

      const stripeSession = await stripe.checkout.sessions.retrieve(
        stripeSessionId
      );

      if (stripeSession?.payment_status === "paid") {
        return true;
      }

      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  async createBookingSession(
    treatmentData: { name: string; schedulePrice: string },
    eventRef: string,
    clientName: string
  ) {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "gbp",
              product_data: {
                name: `${treatmentData.name} booking for ${clientName}`,
              },
              unit_amount: Number(treatmentData.schedulePrice) * 100,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${WEBSITE}/booking-payment?event_ref=${eventRef}&success=true`,
        cancel_url: `${WEBSITE}/booking-payment?event_ref=${eventRef}&canceled=true`,
      });

      const sessionID = session.id;
      return sessionID;
    } catch (e) {
      console.error(e);
    }
  }
}

export default new PurchaseService();
