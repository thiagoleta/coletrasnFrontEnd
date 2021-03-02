import { Component, OnInit } from '@angular/core';
import { Motorista } from 'src/app/models/motorista.model';
import { DialogService } from 'src/app/services/dialog.service';
import { HttpErrorResult } from 'src/app/views/http/http-error-result';
import { MotoristaManterComponent } from '../../manter/motorista-manter/motorista-manter.component';
import { ColunaGenerica } from 'src/app/models/coluna-generica.model';
import { MotoristaService } from 'src/app/services/motorista.service';

@Component({
  selector: 'app-motorista-consulta',
  templateUrl: './motorista-consulta.component.html',
  styleUrls: ['./motorista-consulta.component.css']
})
export class MotoristaConsultaComponent implements OnInit {



  titulo: string = 'Motorista';
  breadcrump: string = 'Manutenção > Cadastros Comuns > Motorista';
  tituloLista: string = 'Motorista';
  tituloAdicionar: string = 'Adicionar Motorista';
  pagina: number = 1;
  ordenacaoColuna: string = '';
  ordenacaoDirecao: 'asc' | 'desc' = 'asc';
  totalDeRegistrosPorPagina: number = 8;
  registros: Array<Motorista>;
  totalDeRegistros: number;
  modal: any = MotoristaManterComponent;
  colunas: Array<ColunaGenerica> = [
    new ColunaGenerica('ID', 'cod_Motorista', true, '7%', 'cod_Motorista'),
    new ColunaGenerica('Nome', 'nome', true, '30%', 'nome'),
    new ColunaGenerica('Telefone Motorista', 'telefone1', true, '27%', 'telefone1'),
    new ColunaGenerica('Telefones Adicionais', 'telefone2', true, '50%', 'telefone2'),
    new ColunaGenerica('Ajutante', 'ajudante1', true, '7%', 'ajudante1'),
    new ColunaGenerica('Ajutantes Adicionais', 'ajudante2', true, '7%', 'ajudante2'),
    new ColunaGenerica('Placa', 'placa', true, '7%', 'placa'),
  ];



  constructor(private service: MotoristaService,
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
      const resultado = await MotoristaManterComponent.exibeModalDeCriar();
      console.log(resultado);
    } catch (error) {
      console.error(error);
    }
    await this.obter();
  }


  async abrirDialogoDeAtualizar(cod_Motorista: number): Promise<void> {
    const entidade: Motorista = this.registros.find(x => x.cod_Motorista === cod_Motorista);
    try {
      await MotoristaManterComponent.exibeModalDeAlterar(entidade);
    } catch (error) {
      console.error(error);
    }
    await this.obter();
  }

  async remover(cod_Motorista: number): Promise<void> {
    const confirm = await this.dialog.showConfirm('Excluir Motorista', 'Deseja excluir o Motorista?');
    if (confirm) {
      try {
        await this.service.remover(cod_Motorista);
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
      this.registros.forEach((m: Motorista) => {
        view.push({
          cod_Motorista: m.cod_Motorista,
          nome: m.nome,
          telefone1: m.telefone1,
          telefone2: m.telefone2,
          ajudante1: m.ajudante1,
          ajudante2: m.ajudante2,
          placa: m.placa,
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
