export interface Article {
    ID: number;
    Title: string;
    User_ID: number
    Author: string;
    Content: string;
    CreateDatetime: string;
    UpdateDatetime: string;
}

// export interface IResponseFormat<T> {
//     StatusCode: number;
//     Message: string;
//     Data: T;
// }