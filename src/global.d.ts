export namespace Express {
  export interface Request {
    user?: User;
  }

  interface User {
    _id: string;
    name: string;
    email: string;
    role: string;
    permissions: string[];

    hasPermission(...permission: string[]): boolean;
  }
}
