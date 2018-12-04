export class Result {
    constructor(status: number, body: Buffer | object | string | number | boolean) {
        this.body = body;
        this.status = status;
    }
    status: number;
    body: Buffer | object | string | number | boolean;
}