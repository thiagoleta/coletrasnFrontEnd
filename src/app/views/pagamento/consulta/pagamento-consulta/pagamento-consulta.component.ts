import { Component, OnInit } from '@angular/core';
import { ColunaGenerica } from 'src/app/models/coluna-generica.model';
import { Pagamento } from 'src/app/models/pagamento.model';
import { DialogService } from 'src/app/services/dialog.service';
import { PagamentoService } from 'src/app/services/pagamento.service';
import { HttpErrorResult } from 'src/app/views/http/http-error-result';
import { PagamentoManterComponent } from '../../manter/pagamento-manter/pagamento-manter.component';

@Component({
  selector: 'app-pagamento-consulta',
  templateUrl: './pagamento-consulta.component.html',
  styleUrls: ['./pagamento-consulta.component.css']
})
export class PagamentoConsultaComponent implements OnInit {
  titulo: string = 'Roteiro';
  breadcrump: string = 'Cadastro > Pagamento';
  tituloLista: string = 'Roteiro';
  tituloAdicionar: string = 'Adicionar Pagamento';
  pagina: number = 1;
  ordenacaoColuna: string = '';
  ordenacaoDirecao: 'asc' | 'desc' = 'asc';
  totalDeRegistrosPorPagina: number = 8;
  registros: Array<Pagamento>;
  totalDeRegistros: number;
  modal: any = PagamentoManterComponent;
  colunas: Array<ColunaGenerica> = [
    new ColunaGenerica('ID', 'cod_Pagamento', true, '2%', 'cod_Pagamento'),
    new ColunaGenerica('Cliente', 'cliente', true, '30%', 'cliente'),
    new ColunaGenerica('Mês/Ano', 'mesReferencia', true, '10%', 'mesReferencia'),
    new ColunaGenerica('Valor Pagamento', 'valor', true, '20%', 'valor'),
    new ColunaGenerica('Data Pagamento', 'data', true, '20%', 'data'),
    
  ];
  
  constructor(
    private service: PagamentoService,
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
      const resultado = await PagamentoManterComponent.exibeModalDeCriar();
      console.log(resultado);
    } catch (error) {
      console.error(error);
    }
    await this.obter();
  }

  
  async abrirDialogoDeAtualizar(cod_Pagamento: number): Promise<void> {
    const entidade: Pagamento = this.registros.find(x => x.cod_Pagamento === cod_Pagamento);
    try {
      await PagamentoManterComponent.exibeModalDeAlterar(entidade);
    } catch (error) {
      console.error(error);
    }
    await this.obter();
  }

  async remover(cod_Pagamento: number): Promise<void> {
    const confirm = await this.dialog.showConfirm('Excluir Pagamento', 'Deseja excluir o Pagamento?');
    if (confirm) {
      try {
        await this.service.remover(cod_Pagamento);
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
      this.registros.forEach((m: Pagamento) => {
        view.push({
          cod_Pagamento: m.cod_Pagamento,          
          cliente: m.cliente.nomeCompleto_RazaoSocial,
          mesReferencia: m.mesReferencia.mesAno,
          valor: m.valor,
          data: m.data,          
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
