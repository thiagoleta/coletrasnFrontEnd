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
import { HttpClientModule } from '@angular/common/http';
import { NgbActiveModal, NgbModalModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ConsultaComponent } from './views/material/consulta/consulta.component';
import { ManterComponent } from './views/material/manter/manter.component';
import { ManutencaoComponent } from './views/manutencao/manutencao.component';
import { ContainerPaginaComponent } from './componentes/container-pagina/container-pagina.component';
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
import { OsConsultaComponent } from './views/os/consulta/os-consulta/os-consulta.component';
import { OsManterComponent } from './views/os/manter/os-manter/os-manter.component';

import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './_interceptors/TokenInterceptor';

import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgxMaskModule, IConfig } from 'ngx-mask';


import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { LOCALE_ID } from '@angular/core';
import { ManutencaoGenericaComponent } from './views/manutencao-generica/manutencao-generica.component';
registerLocaleData(localePt);

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
    PerfilManterComponent,
    OsConsultaComponent,
    OsManterComponent,
    ManutencaoGenericaComponent   
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
    BsDatepickerModule.forRoot(),
    Ng2SearchPipeModule, //registrando biblioteca Ng2SearchFilter
    NgxMaskModule.forRoot() //registrando biblioteca NgxMask      
  ],
  exports: [ManutencaoComponent],
  providers: [
    {       
      provide: HTTP_INTERCEPTORS,     
      useClass: TokenInterceptor,
      multi: true },  
      NgbActiveModal, { provide: LOCALE_ID, useValue: 'pt-BR'}],
    bootstrap: [AppComponent]    
    // { provide: LOCALE_ID, useValue: 'pt'}

})
export class AppModule { 
  constructor(private injector: Injector) {
    StaticInjector.setInjectorInstance(this.injector);
}
}

