import dotenv from "dotenv";
dotenv.config();

export enum Environment {
	Development = "development",
	Production = "production",
	Staging = "staging",
	Local = "local",
}

interface AppSettings {
	environment: Environment;
	port: number;
	databaseUrl: string;
	superAdmin: SuperAdmin;
	authConfig: AuthConfig;
	cryptSecret: string;
	emailConfig: EmailConfig;
	basicAuthUser: BasicAuthUser;
	resetPasswordUrl: string;
	loginUrl: string;
	allowedOrigins: string[];
	errorEmailSendTo: string[];
	apiTimeLoggingEnabled: boolean;
	operationTimeLoggingEnabled: boolean;
	buildVersion: string;
	buildDate: string;
}

interface SuperAdmin {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
}

interface BasicAuthUser {
	userName: string;
	password: string;
}

interface AuthConfig {
	tokenExpirationMinutes: number;
	audience?: string;
	issuer?: string;
	secret: string;
}

interface EmailConfig {
	user: string;
	password: string;
	host: string;
	port: number;
}

// ---------------------------
// ✅ MAIN APP SETTINGS EXPORT
// ---------------------------
export const AppSettings: AppSettings = {
	buildDate: process.env.BUILD_DATE ?? "",
	buildVersion: process.env.BUILD_VERSION ?? "",
	environment:
		(process.env.ENVIRONMENT as Environment) || Environment.Development,
	port: parseInt(process.env.PORT || "3000", 10),
	databaseUrl: process.env.DATABASE_URL ?? "",
	cryptSecret: process.env.CRYPT_SECRET ?? "",

	superAdmin: {
		firstName: process.env.SUPERADMIN__FIRSTNAME ?? "",
		lastName: process.env.SUPERADMIN__LASTNAME ?? "",
		email: process.env.SUPERADMIN__EMAIL ?? "",
		password: process.env.SUPERADMIN__DEFAULTPASSWORD ?? "",
	},

	authConfig: {
		tokenExpirationMinutes: parseInt(process.env.AUTHCONFIG__TOKENEXPIRATIONMINUTES || "480", 10),
		audience: process.env.AUTHCONFIG__AUDIENCE,
		issuer: process.env.AUTHCONFIG__ISSUER,
		secret: process.env.AUTHCONFIG__SECRET ?? "",
	},

	emailConfig: {
		user: process.env.EMAILCONFIG__USER ?? "",
		password: process.env.EMAILCONFIG__PASSWORD ?? "",
		host: process.env.EMAILCONFIG__HOST ?? "",
		port: parseInt(process.env.EMAILCONFIG__PORT || "587", 10),
	},

	basicAuthUser: {
		userName: process.env.BASICAUTH_USERNAME ?? "admin",
		password: process.env.BASICAUTH_PASSWORD ?? "QiDMwtkhwERK90N",
	},

	resetPasswordUrl: process.env.RESET_PASSWORD_URL ?? "",
	loginUrl: process.env.LOGIN_URL ?? "",
	allowedOrigins: (process.env.ALLOWED_ORIGINS || "")
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean),
	errorEmailSendTo: (process.env.ERROR_SEND_TO || "")
		.split(",")
		.map((s) => s.trim())
		.filter(Boolean),

	apiTimeLoggingEnabled:
		process.env.ACTION_TIME_LOGGING_ENABLED?.toLowerCase() === "true",
	operationTimeLoggingEnabled:
		process.env.OPERATION_TIME_LOGGING_ENABLED?.toLowerCase() === "true",
};