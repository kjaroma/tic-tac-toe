import { HttpStatus } from './constants';
export class ApiError extends Error {
    private statusCode: typeof HttpStatus
    constructor(message: string, statusCode: typeof HttpStatus) {
        super(message)
        this.statusCode = statusCode
    }
}