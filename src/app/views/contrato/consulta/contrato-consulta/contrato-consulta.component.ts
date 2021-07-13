import { Component, OnInit } from '@angular/core';
import { ColunaGenerica } from 'src/app/models/coluna-generica.model';
import { Contrato } from 'src/app/models/contrato.model';
import { ContratoService } from 'src/app/services/contrato.service';
import { DialogService } from 'src/app/services/dialog.service';
import { HttpErrorResult } from 'src/app/views/http/http-error-result';
import { ContratoManterComponent } from '../../manter/contrato-manter/contrato-manter.component';

@Component({
  selector: 'app-contrato-consulta',
  templateUrl: './contrato-consulta.component.html',
  styleUrls: ['./contrato-consulta.component.css']
})
export class ContratoConsultaComponent implements OnInit {

  titulo: string = 'Contrato';
  breadcrump: string = 'Cadastro > Contrato';
  tituloLista: string = 'Contrato';
  tituloAdicionar: string = 'Adicionar Contrato';
  pagina: number = 1;
  ordenacaoColuna: string = '';
  ordenacaoDirecao: 'asc' | 'desc' = 'asc';
  totalDeRegistrosPorPagina: number = 8;
  registros: Array<Contrato>;
  totalDeRegistros: number;
  modal: any = ContratoManterComponent;
  colunas: Array<ColunaGenerica> = [
    new ColunaGenerica('ID', 'cod_Contrato', true, '2%', 'cod_Contrato'),
    new ColunaGenerica('Cliente', 'cliente', true, '20%', 'cliente'),
    new ColunaGenerica('Coleta Contratada', 'coletaContratada', true, '20%', 'coletaContratada'),
    new ColunaGenerica('Valor Limite', 'valorLimite', true, '20%', 'valorLimite'),
    new ColunaGenerica('Valor Unidade', 'valorUnidade', true, '20%', 'valorUnidade'),    
    new ColunaGenerica('Termino Contrato', 'flagTermino', true, '30%', 'flagTermino'),    
  ];
  

  constructor(
    private service: ContratoService,
    private dialog: DialogService    
  ) {}


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
      const resultado = await ContratoManterComponent.exibeModalDeCriar();
      console.log(resultado);
    } catch (error) {
      console.error(error);
    }
    await this.obter();
  }

  async abrirDialogoDeAtualizar(cod_Contrato: number): Promise<void> {
    const entidade: Contrato = this.registros.find(x => x.cod_Contrato === cod_Contrato);
    try {
      await ContratoManterComponent.exibeModalDeAlterar(entidade);
    } catch (error) {
      console.error(error);
    }
    await this.obter();
  }

  async remover(cod_Contrato: number): Promise<void> {
    const confirm = await this.dialog.showConfirm('Excluir Contrato', 'Deseja excluir o Contrato?');
    if (confirm) {
      try {
        await this.service.remover(cod_Contrato);
        this.dialog.showAlert('Exclusão realizada com sucesso', 'O registro foi excluído do sistema.');
      } catch (error) {
        this.dialog.showErr('Exclusão não realizada', (error as HttpErrorResult).messages.join('\n'));
      }
      await this.obter();
    }
  }

  get obterResultados(): Array<object> {    
    const view = [];
    if (this.registros) {
      this.registros.forEach((m: Contrato) => {
        view.push({
          cod_Contrato: m.cod_Contrato,          
          cliente: m.cliente.nomeCompleto_RazaoSocial,
          coletaContratada: m.coletaContratada,
          valorLimite: m.valorLimite,
          valorUnidade: m.valorLimite,
          motivoCancelamento: m.motivoCancelamento,
          dataCancelamento: m.dataCancelamento,
          flagTermino: m.flagTermino === 'S' ?'Sim' : 'Não',
          dataTermino: m.dataTermino,          
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
