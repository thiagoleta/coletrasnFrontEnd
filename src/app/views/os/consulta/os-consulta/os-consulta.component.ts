import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, Inject, LOCALE_ID, OnInit, QueryList, ViewChildren } from '@angular/core';
import { ColunaNova } from 'src/app/models/coluna-generica-nova';
import { Os } from 'src/app/models/os.model';
import { DialogService } from 'src/app/services/dialog.service';
import { OsService } from 'src/app/services/os.service';
import { HttpErrorResult } from 'src/app/views/http/http-error-result';
import { NgbdSortableHeader } from 'src/app/views/util/sortable.directive';
import { OsManterComponent } from '../../manter/os-manter/os-manter.component';

@Component({
  selector: 'app-os-consulta',
  templateUrl: './os-consulta.component.html',
  styleUrls: ['./os-consulta.component.css']
})
export class OsConsultaComponent implements OnInit {


  
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  totalDeRegistros: number;
  totalDeRegistrosPorPagina: number = 10;
  pagina: number = 1;
  ordenacaoColuna: string = '';
  ordenacaoDirecao: 'asc' | 'desc' = 'asc';
  registros: Array<Os>;
  modal: any;
  listaQuantidadeRegistros: Array<number> = [8, 15, 30, 50];
  tamanhoPagina: number = 8;
  tamanhoMaximo: number = 6;

  filtro: any;


  constructor(    
    private osService: OsService,
    private dialog: DialogService,    
  ) {}

  ngOnInit() {
    this.modal = OsManterComponent;
    this.obter();
  }

  async obter(): Promise<void> {
    try {

      const resultado = await this.osService
        .obterPaginado(this.pagina, this.tamanhoPagina, this.ordenacaoColuna, this.ordenacaoDirecao);

      this.registros = resultado.data;
      this.totalDeRegistros = resultado.total;
      console.log(this.registros);

    } catch (error) {
      this.dialog.showErr('Não foi possível carregar as informações', (error as HttpErrorResult).messages.join('\n'));
    }
  }

  onSort(nomeColuna: string): void {
    const verificacaoColunasIguais = nomeColuna === this.ordenacaoColuna;

    if (verificacaoColunasIguais) {
      switch (this.ordenacaoDirecao) {
        case 'asc':
          this.ordenacaoDirecao = 'desc';
          break;
        case 'desc':
          this.ordenacaoDirecao = 'asc';
          break;
        default:
          this.ordenacaoDirecao = 'asc';
          break;
      }
    }

    if (!verificacaoColunasIguais) {
      this.ordenacaoDirecao = 'asc';
      this.ordenacaoColuna = nomeColuna;
    }

    this.obter();
  }

  exibirDirecao(ordenacaoColunaEsperada: string, ordenacaoDirecaoEsperada: string) {
    return this.ordenacaoColuna === ordenacaoColunaEsperada && this.ordenacaoDirecao === ordenacaoDirecaoEsperada;
  }

  exibirPaginacao() {
    return this.totalDeRegistros > this.totalDeRegistrosPorPagina;
  }

  alterarQuantidadePorPagina(): void {
    if (this.totalDeRegistros < this.listaQuantidadeRegistros[0] || this.totalDeRegistros) return;
    this.pagina = 1;
    this.obter();
  }

  async abrirDialogoDeCriar(): Promise<void> {
    try {
      // const resultado = await OsManterComponent.exibeModalDeCriar();
      // console.log(resultado);
    } catch (error) {
      console.error(error);
    }
    await this.obter();
  }


  async abrirDialogoDeAtualizar(cod_OS: number): Promise<void> {
    const entidade: Os = this.registros.find(x => x.cod_OS === cod_OS);
    try {
       await OsManterComponent.exibeModalDeAlterar(entidade);
    } catch (error) {
      console.error(error);
    }
    await this.obter();
  }

  async remover(cod_OS: number): Promise<void> {
    const confirm = await this.dialog.showConfirm('Excluir OS', 'Deseja excluir a OS?');
    if (confirm) {
      try {
        await this.osService.remover(cod_OS);
        this.dialog.showAlert('Exclusão realizada com sucesso', 'O registro foi excluído do sistema.');
      } catch (error) {
        this.dialog.showErr('Exclusão não realizada', (error as HttpErrorResult).messages.join('\n'));
      }
      await this.obter();
    }
  }

  async exportar(): Promise<void> {
    try {
      await this.osService.exportar(this.ordenacaoColuna, this.ordenacaoDirecao);
    } catch (error) {
      console.error(error);
      this.dialog.showErr('Não foi possível exportar as informações', (error as HttpErrorResult).messages.join('\n'));
    }
  }


}
