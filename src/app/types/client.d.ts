import { Address } from "./address";
import { PhoneNumber } from "./phone-number";

export type Client = {
  nameFirst: string;
  nameLast: string;
  phoneNumber: PhoneNumber;
  addressPrimary: Address;
  addressBilling: Address;
};
