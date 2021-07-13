import { DatePipe } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ColunaGenerica } from 'src/app/models/coluna-generica.model';
import { MesReferencia } from 'src/app/models/mesreferencia.model';
import { DialogService } from 'src/app/services/dialog.service';
import { MesreferenciaService } from 'src/app/services/mesreferencia.service';
import { HttpErrorResult } from 'src/app/views/http/http-error-result';
import { MesreferenciaManterComponent } from '../../manter/mesreferencia-manter/mesreferencia-manter.component';

@Component({
  selector: 'app-mesreferencia-consulta',
  templateUrl: './mesreferencia-consulta.component.html',
  styleUrls: ['./mesreferencia-consulta.component.css']
})
export class MesreferenciaConsultaComponent implements OnInit {


  titulo: string = 'Mês Referência';
  breadcrump: string = 'Cadastros > Mês Referência';
  tituloLista: string = 'Mês Referência';
  tituloAdicionar: string = 'Mês Referência';
  pagina: number = 1;
  ordenacaoColuna: string = '';
  ordenacaoDirecao: 'asc' | 'desc' = 'asc';
  totalDeRegistrosPorPagina: number = 8;
  registros: Array<MesReferencia>;
  totalDeRegistros: number;
  modal: any = MesreferenciaManterComponent;
  colunas: Array<ColunaGenerica> = [
    new ColunaGenerica('ID', 'cod_MesReferencia', true, '7%', 'cod_MesReferencia'),
    new ColunaGenerica('Mês/Ano', 'mesAno', true, '7%', 'mesAno'),
    new ColunaGenerica('Data Inicio Referência', 'dataInicio', true, '30%', 'dataInicio'),    
    new ColunaGenerica('Data Final Referência', 'dataTermino',  true, '27%', 'dataTermino'),
    new ColunaGenerica('Ativo/Inativo', 'ativo', true, '50%', 'ativo' ),   
    
  ];
  

  constructor(private service: MesreferenciaService,
                private dialog: DialogService,
                @Inject(LOCALE_ID) private locale: string,) { }

  ngOnInit(): void {
    this.obter();
  }

  async obter(): Promise<void> {
    try {
      const result = await this.service
        .obterPaginado(
          this.pagina,
          this.totalDeRegistrosPorPagina,
          this.ordenacaoColuna,
          this.ordenacaoDirecao);
      this.totalDeRegistros = result.total;
      this.registros = result.data;
    } catch (error) {
      console.error(error);
      this.dialog.showErr('Não foi possível carregar as informações', (error as HttpErrorResult).messages.join('\n'));
    }
  }

  async exportar(): Promise<void> {
    try {
      await this.service.exportar(this.ordenacaoColuna, this.ordenacaoDirecao);
    } catch (error) {
      console.error(error);
      this.dialog.showErr('Não foi possível exportar as informações', (error as HttpErrorResult).messages.join('\n'));
    }
  }


  async abrirDialogoDeCriar(): Promise<void> {
    try {
      const resultado = await MesreferenciaManterComponent.exibeModalDeCriar();
      console.log(resultado);
    } catch (error) {
      console.error(error);
    }
    await this.obter();
  }

  async abrirDialogoDeAtualizar(cod_MesReferencia: number): Promise<void> {
    const entidade: MesReferencia = this.registros.find(x => x.cod_MesReferencia === cod_MesReferencia);
    try {
      await MesreferenciaManterComponent.exibeModalDeAlterar(entidade);
    } catch (error) {
      console.error(error);
    }
    await this.obter();
  }


  async remover(cod_MesReferencia: number): Promise<void> {
    const confirm = await this.dialog.showConfirm('Excluir o Mês Referência', 'Deseja excluir o Mês Referência?');
    if (confirm) {
      try {
        await this.service.remover(cod_MesReferencia);
        this.dialog.showAlert('Exclusão realizada com sucesso', 'O registro foi excluído do sistema.');
      } catch (error) {
        this.dialog.showErr('Exclusão não realizada', (error as HttpErrorResult).messages.join('\n'));
      }
      await this.obter();
    }
  }

  get obterResultados(): Array<object> {
    const option = {year: 'numeric',month: 'numeric',day: 'numeric',hour: 'numeric',minute: 'numeric',second: 'numeric',era: ('long' || 'short'),timeZoneName: ('long' || 'short')}
    const locales = 'pt-br';
    const view = [];
    if (this.registros) {
      this.registros.forEach((m: MesReferencia) => {
        view.push({
          cod_MesReferencia: m.cod_MesReferencia,
          mesAno: m.mesAno,
          dataInicio: m.dataInicio.toLocaleString(locales),
          dataTermino: m.dataTermino,
          ativo: m.ativo === true ? 'Sim' : 'Não',          
        });
      });
      return view;
    }
    return null;
  }

  trocarPagina() {
    this.obter();
  }

 

}
