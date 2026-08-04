export interface RoleFunction {
  id: string;
  name?: string;
  description?: string;
}

export interface Role {
  id: string;
  name?: string;
  description?: string;
  functions: RoleFunction[];
}

export interface User {
  id: number;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  accessToken: Token;
  profile: any;
}

export interface Token {
  access_token: string;
  token_type: string;
  expires_in: number;
  resource: string;
  refresh_token: string;
  refresh_token_expires_in: number;
  id_token: string;
}

export const defaultRole: Role = {
  id: "OPERATORE",
  name: "Operatore",
  description: "Operatore SISPAR",
  functions: [],
};

export const roles: Role[] = [
  {
    id: "OPERATORE",
    name: "Operatore",
    description: "Operatore SISPAR",
    functions: [],
  },
  {
    id: "VALIDATORE",
    name: "Validatore",
    description: "Validatore SISPAR",
    functions: [],
  },
  {
    id: "ADMIN",
    name: "Admin",
    description: "Admin SISPAR",
    functions: [],
  },
  {
    id: "SUPERADMIN",
    name: "SuperAdmin",
    description: "Admin SISPAR",
    functions: [],
  },
];
