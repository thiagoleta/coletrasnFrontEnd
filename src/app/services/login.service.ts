import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { HttpErrorResult } from '../views/http/http-error-result';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  // tslint:disable-next-line: no-inferrable-types
  protected endPoint: string = 'Login';

  constructor(private api: HttpClient) { }


  private url(paramentros: string = ''): string {
    return `${environment.local_url}/api/${this.endPoint}/${paramentros}`;
  }

  async logar(command: {
    email: string,
    senha: string
  }): Promise<void> {
    try {
      await this.api.post<void>(this.url(), {
        email: command.email,
        senha: command.senha
      }).toPromise();
    } catch (error) {
      const httpError: HttpErrorResponse = error;
      if (Array.isArray(httpError.error)) {
        throw new HttpErrorResult(httpError.error);
      } else {
        throw new HttpErrorResult(['Erro desconhecido']);
      }
    }
  }

}
