import { Injectable } from '@angular/core';


@Injectable()
export class JwtService {

  getToken(): string {
    return window.localStorage.jwtToken;
  }

  saveToken(acess_token: string) {
    window.localStorage.jwtToken = acess_token;
  }

  destroyToken() {
    window.localStorage.removeItem('jwtToken');
  }

  saveTokenByCrossSite(): boolean {
    if(this.getToken()) {
      this.saveToken(this.getToken());
      return true;
    }

    return false;
  }
}

