export type User = {
  id: string;
  firstName: string;
  lastName: string;
  userAccount?: {
    email: string;
    isAdmin: boolean;
  };
};

export type LoginCredentials = {
  email: string;
  password: string;
}; 