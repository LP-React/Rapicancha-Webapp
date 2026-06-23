export type UserRole = "OWNER" | "CUSTOMER" | "ADMIN";
export type AccountStatus = "ACTIVE" | "INACTIVE" | "PENDING";

export interface SignupRequest {
  email: string;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  phone: string;
  nationalId: string;
}

export interface SignupResponse {
  accountId: number;
  email: string;
  role: UserRole;
  status: AccountStatus | string;
  createdAt: string; // ISO Date String
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accountId: number;
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  profileId: number;
  token: string;
}
