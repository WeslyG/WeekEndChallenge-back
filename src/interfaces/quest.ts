export interface IQuest {
    id?: string;
    name?: string;
    tag?: string;
    price?: number;
    description?: string;
    answers?: [string];
}