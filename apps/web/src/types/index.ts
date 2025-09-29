export interface Message {
    id:number;
    content:string;
    authorId:string;
    role:"User"|"Ai";
    chatId:string;
}
