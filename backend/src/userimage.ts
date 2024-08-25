export class UserImage {
    Id: bigint;
    ProcessedUrl: string;
    Categories: Array<UserImageCategory>;
}

export class UserImageCategory {
    Id: bigint;
    Name: string;
}