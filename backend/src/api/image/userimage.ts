export class UserImage {
    Id: number;
    ProcessedUrl: string;
    Categories: Array<UserImageCategory> = [];
}

export class UserImageCategory {
    Id: number;
    Name: string;
}