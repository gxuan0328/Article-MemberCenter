export interface Article {
    Id: number;
    Title: string;
    User_Id: number
    Name: string;
    Content: string;
    CreateDatetime: string;
    UpdateDatetime: string;
}
export interface Articles {
    Id: number;
    Title: string;
    Name: string;
    CreateDatetime: string;
}
export interface newArticle {
    Title: string;
    User_Id: number
    Content: string;
}
export interface Search {
    Title: string,
    Author: string,
    FromDate: string,
    ToDate: string,
}