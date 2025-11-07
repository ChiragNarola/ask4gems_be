import { UserRoleType } from "../types";

export interface IAuthDTO {
	userId: number;
	firstName: string;
	lastName: string;
	email: string;
	role: UserRoleType;
	profilePicture?: string | null;
	token: string;
	tokenValidTo: Date;
	createdAt: Date;
}

export interface IUserDTO {
	userId: number;
	firstName: string;
	lastName: string;
	email: string;
	role: UserRoleType;
	profilePicture?: string | null;
	createdAt: Date;
	cntCheckedVAT?: number;
}