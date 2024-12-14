export type TUser = {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: Array<"admin" | "user" | "creator">; // or ("admin" | "user" | "creator")[]
}

export type TGlobalStore = {
    user: TUser | null;
    token: string | null;
    setUser: (user: Partial<TUser>) => void;
    setToken: (token: string) => void;
}

export type TRefreshResponse = {
    accessToken: string
}