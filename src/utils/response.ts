import * as status from 'http-status';
import { injectable } from 'inversify';

@injectable()
export class Response {

    dataResponse(data: any) {
        const response = {
            code: status.OK,
            success: true,
            data
        };
        return response;
    }
    
}