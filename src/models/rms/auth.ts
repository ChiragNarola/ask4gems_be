export interface IAuthRM {
    email: string;
    password: string;
}

export interface IChangePasswordRM {
    oldPassword: string;
    newPassword: string;
}

export interface IResetPasswordRM {
    token: string;
    newPassword: string;
}