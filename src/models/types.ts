import { User, ActivityLog } from '@prisma/client';

/**
 * 🔹 Defines the possible user roles in the system.
 */
export type UserRoleType = 'Admin' | 'User';

/**
 * 🔹 Supported external or third-party API integrations.
 */
// export type ThirdPartyApiName = 'podatki' | 'krs' | 'krz' | 'ceidg' | 'vies';

/**
 * 🔹 A user object safe to expose (excludes sensitive fields).
 */
export type SafeUser = Omit<User, 'passwordHash' | 'securityStamp'>;

/**
 * 🔹 A safe user object with optional extra metadata (for API responses).
 */
export type SafeUserWithRole = SafeUser & {
	userType: UserRoleType;
	cntCheckedVAT?: number;
};

/**
 * 🔹 A full user record (includes all fields from Prisma model).
 */
export type UserWithRole = User & {
	userType: UserRoleType;
	cntCheckedVAT?: number;
};

/**
 * 🔹 An activity log record joined with a safe user reference.
 */
export type ActivityLogWithSafeUser = ActivityLog & {
	user?: SafeUserWithRole | null;
};
