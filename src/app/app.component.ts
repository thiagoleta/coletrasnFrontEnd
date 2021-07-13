import { Component, OnInit } from '@angular/core';
import { AuthHelper } from './_helpers/auth.helper';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  isLoggedIn = false;
  mensagem: string;

  constructor(
    private authHelper: AuthHelper,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isLoggedIn = this.authHelper.isLoggedIn();
  }

  autenticarUsuario(formLogin): void {

    let request = formLogin.form.value;

    this.authService.post(request)
      .subscribe(
        (data:any) => {
          this.authHelper.signIn(request.email, data.token, data.expiraEm);
          this.ngOnInit();
        },
        e => {
          this.mensagem = "Acesso não autorizado.";
        }
      );
  }

  sairDoSistema() : void {
    if(window.confirm('Deseja realmente sair do sistema?')){
      this.authHelper.signOut();
      this.ngOnInit();
    }
  }
}


