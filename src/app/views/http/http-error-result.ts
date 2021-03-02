import { HttpErrorResponse } from '@angular/common/http';

export class HttpErrorResult {
    constructor(messages: string[]) {
        this.messages = messages;
    }
    readonly messages: string[];
    public static fromError(error: HttpErrorResponse): HttpErrorResult {
        const httpError: HttpErrorResponse = error;
        if (Array.isArray(httpError.error)) {
            return new HttpErrorResult(httpError.error);
        } else {
            return new HttpErrorResult(['Erro desconhecido']);
        }
    }
}
