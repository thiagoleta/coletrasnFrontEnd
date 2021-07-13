
  import { Injectable } from '@angular/core';
  
  @Injectable({
      providedIn: 'root'
  })
  export class AuthHelper{
  
      //função para gravar os dados de autenticação do usuário
      signIn(username, accesstoken, tokenexpiration) : void {
          //gravar os dados em localStorage
          window.localStorage.setItem("auth", 
              JSON.stringify({
                  username, accesstoken, tokenexpiration
              })
          );
      }
  
      //função para fazer o logout do usuario
      signOut() : void {
          //apagar o conteudo da localstorage
          window.localStorage.removeItem("auth");
      }
  
      //função para retornar o valor do token
      getAccessToken() : string{
          var auth = JSON.parse(window.localStorage.getItem("auth"));
          return auth.accesstoken;
      }
  
      //função para verificar se o usuário está autenticado
      isLoggedIn() : boolean{
          var auth = JSON.parse(window.localStorage.getItem("auth"));
          return auth !== null && auth.accesstoken !== null;
      }
  }
  
  
  
  