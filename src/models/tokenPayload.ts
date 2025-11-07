import { UserRoleType } from "./types";

export interface ITokenPayload {
    userId: string;
    email: string;
    role: UserRoleType;
    stamp: string; // Not in use
}

export interface IGeneratedToken {
  token: string;
  validTo: Date;
}