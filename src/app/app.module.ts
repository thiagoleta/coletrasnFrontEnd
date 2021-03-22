import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FooterComponent } from './components/template/footer/footer.component';
import { HeaderComponent } from './components/template/header/header.component';
import { NavComponent } from './components/template/nav/nav.component';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { AlertsModule } from 'angular-alert-module';

// biblioteca para desenvolvimento de formulários dinâmicos
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// tslint:disable-next-line: comment-format
//biblioteca para executar as chamadas HTTP (POST, PUT, GET, DELETE) para uma API
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { NgbActiveModal, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConsultaComponent } from './views/material/consulta/consulta.component';
import { ManterComponent } from './views/material/manter/manter.component';
import { ManutencaoComponent } from './views/manutencao/manutencao.component';
import { ContainerPaginaComponent } from './componentes/container-pagina/container-pagina.component';
import { HttpTokenInterceptor } from './interceptors/http.token.interceptor';
import { JwtService } from './services/jwt.service';
import { CommonModule } from '@angular/common';
import { StaticInjector } from 'src/app/services/static-injector';
import { Injector } from '@angular/core';
import { NgbdSortableHeader } from './views/util/sortable.directive';
import { CurrencyMaskModule } from 'ng2-currency-mask';
import { TextMaskModule } from 'angular2-text-mask';
import { MotoristaConsultaComponent } from './views/motorista/consulta/motorista-consulta/motorista-consulta.component';
import { MotoristaManterComponent } from './views/motorista/manter/motorista-manter/motorista-manter.component';
import { RotaConsultaComponent } from './views/rota/consulta/rota-consulta/rota-consulta.component';
import { RotaManterComponent } from './views/rota/manter/rota-manter/rota-manter.component';
import { ClienteConsultaComponent } from './views/cliente/consulta/cliente-consulta/cliente-consulta.component';
import { ClienteManterComponent } from './views/cliente/manter/cliente-manter/cliente-manter.component';
import { FitrosComponent } from './views/cliente/filtros/fitros/fitros.component';
import { MesreferenciaConsultaComponent } from './views/mesreferencia/consulta/mesreferencia-consulta/mesreferencia-consulta.component';
import { MesreferenciaManterComponent } from './views/mesreferencia/manter/mesreferencia-manter/mesreferencia-manter.component';
import { LOCALE_ID } from '@angular/core';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { RoteiroConsultaComponent } from './views/roteiro/consulta/roteiro-consulta/roteiro-consulta.component';
import { RoteiroManterComponent } from './views/roteiro/manter/roteiro-manter/roteiro-manter.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ContratoConsultaComponent } from './views/contrato/consulta/contrato-consulta/contrato-consulta.component';
import { ContratoManterComponent } from './views/contrato/manter/contrato-manter/contrato-manter.component';
import { PagamentoManterComponent } from './views/pagamento/manter/pagamento-manter/pagamento-manter.component';
import { PagamentoConsultaComponent } from './views/pagamento/consulta/pagamento-consulta/pagamento-consulta.component';
import { UsuarioConsultaComponent } from './views/usuario/consulta/usuario-consulta/usuario-consulta.component';
import { PerfilConsultaComponent } from './views/perfil/consulta/perfil-consulta/perfil-consulta.component';
import { UsuarioManterComponent } from './views/usuario/manter/usuario-manter/usuario-manter.component';
import { PerfilManterComponent } from './views/perfil/manter/perfil-manter/perfil-manter.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    NavComponent,
    HomeComponent,
    LoginComponent,
    ManterComponent,
    ConsultaComponent,
    ManutencaoComponent,
    ContainerPaginaComponent,
    NgbdSortableHeader,
    MotoristaConsultaComponent,
    MotoristaManterComponent,
    RotaConsultaComponent,
    RotaManterComponent,
    ClienteConsultaComponent,
    ClienteManterComponent,
    FitrosComponent,
    MesreferenciaConsultaComponent,
    MesreferenciaManterComponent,
    RoteiroConsultaComponent,
    RoteiroManterComponent,
    ContratoConsultaComponent,
    ContratoManterComponent,
    PagamentoManterComponent,
    PagamentoConsultaComponent,
    UsuarioConsultaComponent,
    PerfilConsultaComponent,
    UsuarioManterComponent,
    PerfilManterComponent   
  ],
  imports: [
    BrowserModule,
    CommonModule,
    NgbModalModule,
    AppRoutingModule,
    AlertsModule.forRoot(),        
    [NgSelectModule, FormsModule],
    HttpClientModule,
    NgbModule,
    ReactiveFormsModule,
    CurrencyMaskModule,
    TextMaskModule,
    BrowserAnimationsModule,    
    BsDatepickerModule.forRoot()      
  ],
  exports: [ManutencaoComponent],
  providers: [
    { provide: LOCALE_ID, useValue: 'pt-BR' },     
    CookieService,
    JwtService,
    NgbActiveModal],         
  bootstrap: [AppComponent],   
})
export class AppModule { 
  constructor(private injector: Injector) {
    StaticInjector.setInjectorInstance(this.injector);
}
}

