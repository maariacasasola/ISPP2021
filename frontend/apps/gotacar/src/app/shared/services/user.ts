export interface User {
    id: string;
    firstName: string;
    lastName: string;
    uid: string;
    email: string;
    dni: string;
    profilePhoto: string;
    birthdate: Date;
    roles: string[];
    token: string;
    emailVerified: boolean;
  }