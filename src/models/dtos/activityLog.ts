import { ActivityLevel } from "@prisma/client";
import { IUserDTO } from "./auth";

export interface IActivityLogDTO {
	id: string;
	level: ActivityLevel;
	data: any;
	createdAt: Date;
	userId: number;
	user: IUserDTO;
}