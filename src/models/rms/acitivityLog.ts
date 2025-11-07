import { ActivityLevel } from "@prisma/client";

export interface IActivityLogFilterOptions {
    levels?: ActivityLevel[];
    userId?: string;
}