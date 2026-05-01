export const BF_ORDER_SUCCESS_KEY = "bf_order_success";

export type OrderSuccessSummary = {
  customerName: string;
  cakeType: string;
  cakeSize: string;
  cakeFlavor: string;
  isEggless: boolean;
  messageOnCake: string | null;
  deliveryDate: string;
  deliveryTimeSlot: string;
  deliveryMethod: "pickup" | "delivery";
  deliveryAddress: string | null;
  specialInstructions: string | null;
  referenceCount: number;
};

export type OrderSuccessPayload = {
  id: string;
  orderNumber: string;
  customerPhone: string;
  status: string | null;
  summary?: OrderSuccessSummary;
};
