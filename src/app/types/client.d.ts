import { Address } from "./address";
import { PhoneNumber } from "./phone-number";

export type Client = {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: PhoneNumber;
  addressPrimary: Address;
  addressBilling: Address;
};
