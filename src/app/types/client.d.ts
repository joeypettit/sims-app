import { Address } from "./address";
import { PhoneNumber } from "./phone-number";

export type Client = {
  firstName: string;
  lastName: string;
  phoneNumber: PhoneNumber;
  addressPrimary: Address;
  addressBilling: Address;
};
