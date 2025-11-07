export interface IUpdateProfileRM {
    firstName: string;
    lastName: string;
}

export interface ICreateUserRM {
    firstName: string;
    lastName: string;
    email: string;
}

export interface IUpdateUserRM {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
}