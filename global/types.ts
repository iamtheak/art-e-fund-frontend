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
    creatorId?: number;
}

export type TCreator =
    Pick<TUser, 'userId' | 'userName' | 'profilePicture' | 'role' | 'firstName' | 'lastName' | 'email'>
    & {
    creatorId: number;
    creatorDescription: string;
    creatorBio: string;
    creatorGoal: string;
    contentType: string;
    creatorBanner: string;
    hasPosts: boolean;
    hasMembership: boolean;
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

export type TMembership = {
    membershipId: number
    membershipTier: number
    membershipName: string
    creatorId: number,
    membershipAmount: number
    membershipBenefits: string
}
