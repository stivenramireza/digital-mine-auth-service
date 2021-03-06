import * as status from 'http-status';
import { injectable } from 'inversify';

@injectable()
export class Responses {

    dataResponse(data: any) {
        const response = {
            code: status.OK,
            success: true,
            data
        };
        return response;
    }
    
}