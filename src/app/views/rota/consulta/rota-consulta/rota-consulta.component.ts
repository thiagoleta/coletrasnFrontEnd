import { Component, OnInit } from '@angular/core';
import { ColunaGenerica } from 'src/app/models/coluna-generica.model';
import { Rota } from 'src/app/models/rota.model';
import { DialogService } from 'src/app/services/dialog.service';
import { RotaService } from 'src/app/services/rota.service';
import { HttpErrorResult } from 'src/app/views/http/http-error-result';
import { RotaManterComponent } from '../../manter/rota-manter/rota-manter.component';

@Component({
  selector: 'app-rota-consulta',
  templateUrl: './rota-consulta.component.html',
  styleUrls: ['./rota-consulta.component.css']
})
export class RotaConsultaComponent implements OnInit {

  titulo: string = 'Rota';
  breadcrump: string = 'Cadastros > Rota';
  tituloLista: string = 'Rota';
  tituloAdicionar: string = 'Adicionar Rota';
  pagina: number = 1;
  ordenacaoColuna: string = '';
  ordenacaoDirecao: 'asc' | 'desc' = 'asc';
  totalDeRegistrosPorPagina: number = 8;
  registros: Array<Rota>;
  totalDeRegistros: number;
  modal: any = RotaManterComponent;
  colunas: Array<ColunaGenerica> = [
    new ColunaGenerica('ID', 'cod_Rota', true, '5%', 'cod_Rota'),
    new ColunaGenerica('Nome', 'nome', true, '35%', 'nome'),
    new ColunaGenerica('Composição da Rota', 'composicao_Rota', true, '35%', 'composicao_Rota'),
    new ColunaGenerica('Ativo', 'flag_Ativo', true, '7%', 'flag_Ativo'),
    new ColunaGenerica('Observações', 'observacao', true, '35%', 'observacao'),
  ];



  constructor(private service: RotaService,
    private dialog: DialogService) { }

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
      const resultado = await RotaManterComponent.exibeModalDeCriar();
      console.log(resultado);
    } catch (error) {
      console.error(error);
    }
    await this.obter();
  }

  async abrirDialogoDeAtualizar(cod_Rota: number): Promise<void> {
    const entidade: Rota = this.registros.find(x => x.cod_Rota === cod_Rota);
    try {
      await RotaManterComponent.exibeModalDeAlterar(entidade);
    } catch (error) {
      console.error(error);
    }
    await this.obter();
  }

  async remover(cod_Rota: number): Promise<void> {
    const confirm = await this.dialog.showConfirm('Excluir Rota', 'Deseja excluir o Rota?');
    if (confirm) {
      try {
        await this.service.remover(cod_Rota);
        this.dialog.showAlert('Exclusão realizada com sucesso', 'O registro foi excluído do sistema.');
      } catch (error) {
        this.dialog.showErr('Exclusão não realizada', (error as HttpErrorResult).messages.join('\n'));
      }
      await this.obter();
    }
  }

  // async obterEventos() {
  //   try {
  //     const eventos = await this.eventoService.obter();
  //     this.eventos = eventos.map(evento => ({ id: evento.id, descricao: evento.ativo ? evento.nome.toUpperCase() : evento.nome.toUpperCase().concat(' [INATIVO]') }));
  //     console.log(this.eventos);
  //   } catch (error) {
  //     await this.dialog.showErr('Erro ao obter Eventos', (error as HttpErrorResult).messages.join('\n'));
  //   }
  // }


  get obterResultados(): Array<object> {    
    const view = [];
    if (this.registros) {
      this.registros.forEach((m: Rota) => {
        view.push({
          cod_Rota: m.cod_Rota,
          nome: m.nome,
          composicao_Rota: m.composicao_Rota,
          flag_Ativo: m.flag_Ativo == true ?'Sim' : 'Não',
          observacao: m.observacao,
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


