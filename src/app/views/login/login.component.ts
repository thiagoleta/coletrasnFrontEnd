import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  endpointLocalHost = 'http://localhost:55628/api/Login';

  endpointProd = 'http://thiagoleta2-001-site1.htempurl.com/api/Login';

  mensagemAcesso: string;

  constructor(private loginService: LoginService,
              private httpClient: HttpClient,
              private cookieService: CookieService) { }

  ngOnInit(): void {

  }

  autenticarUsuario(formAcesso) {
    this.mensagemAcesso = 'Processando, por favor aguarde...';

    // acessando a API..
    this.httpClient.post(this.endpointProd, formAcesso.value)
      .subscribe(
        (data: any) => {
          this.mensagemAcesso = data.mensagem;
          formAcesso.reset();
          this.cookieService.set('access_token', data.token);
          window.location.href = "/"; //raiz do projeto

        },
        e => {
          this.mensagemAcesso = 'Acesso não autorizado.';
          console.log(e.error);
        }
      );
  }
}
