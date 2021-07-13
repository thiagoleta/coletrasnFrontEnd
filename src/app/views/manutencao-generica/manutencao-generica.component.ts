import { Component,OnInit, ViewChildren, Output, QueryList, EventEmitter, Input  } from '@angular/core';
import { ColunaGenerica } from 'src/app/models/coluna-generica.model';
import { NgbdSortableHeader, SortEvent } from '../util/sortable.directive';

@Component({
  selector: 'app-manutencao-generica',
  templateUrl: './manutencao-generica.component.html',
  styleUrls: ['./manutencao-generica.component.css']
})
export class ManutencaoGenericaComponent implements OnInit {
  // One-way binding
  @Input() colunas: Array<ColunaGenerica>;
  @Input() registros: Array<any>;
  
  @Input() totalDeRegistros: number;
  @Input() mensagemNenhumRegistroEncontrado: string;
  @Input() tableWidth?: string;
  @Input() allowChanges: boolean;

  // Two-way binding
  @Input() pagina: number = 1;
  @Output() paginaChange: EventEmitter<number> = new EventEmitter<number>();
  @Input() ordenacaoColuna: string = '';
  @Output() ordenacaoColunaChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() ordenacaoDirecao: string = '';
  @Output() ordenacaoDirecaoChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() totalDeRegistrosPorPagina: number;
  @Output() totalDeRegistrosPorPaginaChange: EventEmitter<number> = new EventEmitter<number>();

  // Events
  @Output() aoClicarVisualizarRegistro = new EventEmitter<any>();
  @Output() aoClicarEditarRegistro = new EventEmitter<any>();
  @Output() aoRemoverRegistro = new EventEmitter<any>();
  @Output() aoCarregarRegistros = new EventEmitter();
  @Output() registroSelecionadoChange = new EventEmitter<any>();

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  listaQuantidadeDeRegistrosPorPagina: Array<number> = [ 8, 15, 35, 50 ];
  registroSelecionado: any = null;

  constructor() { }

  ngOnInit() { }

  aoVisualizar() {
    this.aoClicarVisualizarRegistro.emit(this.registroSelecionado);
  }

  aoEditar() {
    this.aoClicarEditarRegistro.emit(this.registroSelecionado);
  }

  aoRemover() {
    this.aoRemoverRegistro.emit(this.registroSelecionado);
  }


  selecionar(registro) {
    if (this.registroSelecionado === registro) {
      this.registroSelecionado = null;
      this.registroSelecionadoChange.emit(this.registroSelecionado);
      return;
    }

    this.registroSelecionado = registro;
    this.registroSelecionadoChange.emit(this.registroSelecionado);
  }

  onSort({column, direction}: SortEvent) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.ordenacaoColuna = column;
    this.ordenacaoDirecao = direction;
    if (direction.length === 0) this.ordenacaoColuna = '';

    this.ordenacaoColunaChange.emit(this.ordenacaoColuna);
    this.ordenacaoDirecaoChange.emit(this.ordenacaoDirecao);
    this.registroSelecionado = null;
    this.carregarDados();
  }

  onPageChange() {
    this.registroSelecionado = null;
    this.paginaChange.emit(this.pagina);
    this.carregarDados();
  }

  exibirDirecao(ordenacaoColunaEsperada: string, ordenacaoDirecaoEsperada: string) {
    return this.ordenacaoColuna === ordenacaoColunaEsperada && this.ordenacaoDirecao === ordenacaoDirecaoEsperada;
  }

  exibirPaginacao() {
    return this.totalDeRegistros > this.totalDeRegistrosPorPagina;
  }

  alterarTotalDeRegistros() {
    this.pagina = 1;
    this.paginaChange.emit(this.pagina);

    this.registroSelecionado = null;
    this.totalDeRegistrosPorPaginaChange.emit(this.totalDeRegistrosPorPagina);
    this.carregarDados();
  }

  carregarDados() {
    this.aoCarregarRegistros.emit();
  }
}

