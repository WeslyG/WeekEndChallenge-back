import { IQuest } from '../interfaces/quest';

export class Quest {

    constructor(quest: IQuest) {
        this.id = quest.id;
        this.name = quest.name;
        this.tag = quest.tag;
        this.price = quest.price;
        this.completed = quest.completed;
    }

    id: string;
    name: string;
    tag: string;
    price: number;
    completed: boolean;
}
