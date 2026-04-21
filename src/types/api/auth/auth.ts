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
  idAccount: number;
  email: string;
  passwordHash: string;
  role: UserRole;
  status: AccountStatus;
  emailVerified: boolean;
  createdAt: string; // ISO Date String
  updatedAt: string; // ISO Date String
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse extends SignupResponse {}
