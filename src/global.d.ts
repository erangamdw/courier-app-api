declare namespace Express {
    export interface Request {
        user?: User;
    }

    interface User {
        _id: string;
        name: string;
        email: string;
        role: string;
        permissions: string[];

        hasPermission(...permissions: string[]): boolean;
    }
}
