import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { from } from 'rxjs';

import { HomeComponent } from './views/home/home.component';
import {LoginComponent} from './views/login/login.component';
import {ManterComponent} from './views/material/manter/manter.component';
import {ConsultaComponent} from './views/material/consulta/consulta.component';
import {MotoristaManterComponent} from './views/motorista/manter/motorista-manter/motorista-manter.component';
import {MotoristaConsultaComponent} from './views/motorista/consulta/motorista-consulta/motorista-consulta.component';
import {RotaConsultaComponent} from './views/rota/consulta/rota-consulta/rota-consulta.component';
import {RotaManterComponent} from './views/rota/manter/rota-manter/rota-manter.component';
import {ClienteManterComponent} from './views/cliente/manter/cliente-manter/cliente-manter.component';
import {ClienteConsultaComponent} from './views/cliente/consulta/cliente-consulta/cliente-consulta.component';
import {MesreferenciaConsultaComponent} from './views/mesreferencia/consulta/mesreferencia-consulta/mesreferencia-consulta.component'
import {MesreferenciaManterComponent} from './views/mesreferencia/manter/mesreferencia-manter/mesreferencia-manter.component'
import {RoteiroConsultaComponent} from './views/roteiro/consulta/roteiro-consulta/roteiro-consulta.component'
import {RoteiroManterComponent} from  './views/roteiro/manter/roteiro-manter/roteiro-manter.component'




const routes: Routes = [{
  path: '',
  component: HomeComponent
},

{
  path: 'material-manter',
  component: ManterComponent
},
{
  path: 'material-consulta',
  component: ConsultaComponent
},
{
  path: 'motorista-manter',
  component: MotoristaManterComponent
},
{
  path: 'motorista-consulta',
  component: MotoristaConsultaComponent
},
{
  path: 'rota-consulta',
  component: RotaConsultaComponent
},
{
  path: 'rota-manter',
  component: RotaManterComponent
},
{
  path: 'cliente-consulta',
  component: ClienteConsultaComponent
},
{
  path: 'cliente-manter',
  component: ClienteManterComponent
},
{
  path: 'mesreferencia-consulta',
  component: MesreferenciaConsultaComponent
},
{
  path: 'mesreferencia-manter',
  component: MesreferenciaManterComponent
},
{
  path: 'login',
  component: LoginComponent
},
{
  path: 'roteiro-consulta',
  component: RoteiroConsultaComponent
},
{
  path: 'roteiro-manter',
  component: RoteiroManterComponent
},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
