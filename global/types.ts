export type TUser = {
    userId: string;
    email: string;
    firstName: string;
    lastName: string;
    userName: string;
    role: "admin" | "user" | "creator"; // or ("admin" | "user" | "creator")[]
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: string;
    refreshTokenExpires: string;
    profilePicture: string;
    error?: string | null;
}

export type TRefreshResponse = {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: string;
    refreshTokenExpires: string;
}

export type TLoginResponse = {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: string;
    refreshTokenExpires: string;
    message: string;
    user: Omit<TUser, 'accessToken' | 'refreshToken' | 'accessTokenExpires' | 'refreshTokenExpires'>;
}

export type TToken = {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires: string;
    refreshTokenExpires: string;
    error?: string | null;
}

