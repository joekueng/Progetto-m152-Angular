export interface UserEntity {
    id: number;
    username: string;
    password: string;
    admin?: boolean;
}

export interface newUser {
    username: string;
    password: string;
}
