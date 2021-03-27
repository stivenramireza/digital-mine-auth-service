export default class Conflict extends Error {

    public data: any;
    constructor(message: string, data?: any) {
        super(message);
        this.data = data;
    }
}