import { Component, OnInit } from '@angular/core';
import { Cliente } from 'src/app/models/cliente.model';
import { ColunaGenerica } from 'src/app/models/coluna-generica.model';
import { ClienteService } from 'src/app/services/cliente.service';
import { DialogService } from 'src/app/services/dialog.service';
import { HttpErrorResult } from 'src/app/views/http/http-error-result';
import { isNullOrUndefined } from 'util';
import { ClienteManterComponent } from '../../manter/cliente-manter/cliente-manter.component';

@Component({
  selector: 'app-cliente-consulta',
  templateUrl: './cliente-consulta.component.html',
  styleUrls: ['./cliente-consulta.component.css']
})
export class ClienteConsultaComponent implements OnInit {

  titulo: string = 'Cliente';
  breadcrump: string = 'Manutenção > Cadastros Comuns > Cliente';
  tituloLista: string = 'Cliente';
  tituloAdicionar: string = 'Adicionar Cliente';
  pagina: number = 1;
  
  
  totalDeRegistrosPorPagina: number = 8;
  ordenacaoColuna: 'nomeCompleto_RazaoSocial' | 'cpF_CNPJ' | 'fantasia' | 'insc_Estadual' | 'bairro' | 'endereco' | 'cEP' | 'telefones' | 'email' | 'flag_Ativo' | 'observacao' | 'referencia' = 'nomeCompleto_RazaoSocial';
  ordenacaoDirecao: 'asc' | 'desc' = 'asc';

  registros: Array<Cliente> = [];
  // tslint:disable-next-line: no-inferrable-types
  totalDeRegistros: number = 0;

  colunas: Array<ColunaGenerica> = [
    new ColunaGenerica('NomeCompleto RazaoSocial', 'nomeCompleto_RazaoSocial', true, '29%', 'nomeCompleto_RazaoSocial'),
    new ColunaGenerica('CNPJ/CPF', 'cpF_CNPJ', true, '14%', 'cpF_CNPJ'),
    new ColunaGenerica('Fantasia', 'fantasia', true, '10%', 'fantasia'),
    new ColunaGenerica('Inscrição Estadual', 'insc_Estadual', true, '16%', 'insc_Estadual'),
    new ColunaGenerica('Bairro', 'bairro', true, '12%', 'bairro'),
    new ColunaGenerica('Endereco', 'endereco', true, '10%', 'endereco'),
    new ColunaGenerica('CEP', 'cep', true, '10%', 'cEP'),
    new ColunaGenerica('Telefones', 'telefones', true, '10%', 'telefones'),
    new ColunaGenerica('E-mail', 'email', true, '10%', 'email'),
    new ColunaGenerica('Ativo', 'flag_Ativo', true, '10%', 'flag_Ativo'),
    new ColunaGenerica('Observação', 'observacao', true, '10%', 'observacao'),
    new ColunaGenerica('Referência', 'referencia', true, '10%', 'referencia'),
  ];

  constructor(
    private clienteService: ClienteService,
    private dialog: DialogService) { }

  private ultimoFiltro?: { nomeCompleto_RazaoSocial: string, cpF_CNPJ: string };


  ngOnInit(): void {
    this.obter();
  }

  async obter(filtro?: { nomeCompleto_RazaoSocial: string, cpF_CNPJ: string }): Promise<void> {
     //this.ultimoFiltro === filtro ? this.ultimoFiltro : filtro;

    // if ((this.ultimoFiltro.nomeCompleto_RazaoSocial || this.ultimoFiltro.nomeCompleto_RazaoSocial === '') &&
    //   (this.ultimoFiltro.cPF_CNPJ || this.ultimoFiltro.cPF_CNPJ === '')) {
    //   this.dialog.showErr('Filtro não preenchido', 'Ao menos um dos três filtros devem estar preenchidos: Nome, Tipo, CPF/CNPJ.');
    //   return;
    // }

    try {
      const result = await this.clienteService.obterPaginado(
        this.pagina,
         this.totalDeRegistrosPorPagina,
        this.ordenacaoColuna,
         this.ordenacaoDirecao,
        filtro.nomeCompleto_RazaoSocial, 
        filtro.cpF_CNPJ);
      this.totalDeRegistros = result.total;
      this.registros = result.data;
    } catch (error) {
      this.dialog.showErr('Não foi possível carregar as informações', (error as HttpErrorResult).messages.join('\n'));
    }
  }



  async abrirDialogoDeCriar(): Promise<void> {
    try {
      await ClienteManterComponent.exibeModalDeCriar();
    } catch (error) {
      console.error(error);
    }
    // TODO: Verificar como proceder com esse if
    // if (!Object.keys(this.ultimoFiltro).some(x => this.ultimoFiltro[x] !== void 0)) {
    if (this.temFiltro()) {
      await this.obter(this.ultimoFiltro);
    }
  }

  async abrirDialogoDeAtualizar(cod_Cliente: number): Promise<void> {
    const entidade: Cliente = this.registros.find(x => x.cod_Cliente === cod_Cliente);
    try {
      await ClienteManterComponent.exibeModalDeAlterar(entidade);
    } catch (error) {
      console.error(error);
    }
    if (this.temFiltro()) {
      await this.obter(this.ultimoFiltro);
    }
  }

  async remover(cod_Cliente: number): Promise<void> {
    const confirm = await this.dialog.showConfirm('Excluir Cliente', 'Deseja excluir o Cliente?');
    if (confirm) {
      try {
        await this.clienteService.remover(cod_Cliente);
        this.dialog.showAlert('Exclusão realizada com sucesso', 'O registro foi excluído do sistema.');
      } catch (error) {
        this.dialog.showErr('Exclusão não realizada', (error as HttpErrorResult).messages.join('\n'));
      }
      this.obter(this.ultimoFiltro);
    }
  }

  temFiltro() {
    return this.ultimoFiltro !== undefined && (this.ultimoFiltro.nomeCompleto_RazaoSocial !== '' || this.ultimoFiltro.cpF_CNPJ !== '');
  }

  
  async exportar(): Promise<void> {
    try {
      await this.clienteService.exportar(this.ordenacaoColuna, this.ordenacaoDirecao);
    } catch (error) {
      console.error(error);
      this.dialog.showErr('Não foi possível exportar as informações', (error as HttpErrorResult).messages.join('\n'));
    }
  }

  get obterResultados(): Array<object> {
    const view = [];
    this.registros.forEach((p: Cliente) => {
      view.push({
        cod_Cliente: p.cod_Cliente,
        cpF_CNPJ: p.cpF_CNPJ,
        nomeCompleto_RazaoSocial: p.nomeCompleto_RazaoSocial,
        fantasia: p.fantasia,
        insc_Estadual: p.insc_Estadual,
        logradouro: p.logradouro,
        endereco: p.endereco,
        bairro: p.bairro,
        complemento: p.complemento,
        cidade: p.cidade,
        cep: p.cep,
        uF: p.uF,
        telefones: p.telefones,
        funcao: p.funcao,
        email: p.email,
        flag_Ativo: p.flag_Ativo ? 'Sim' : 'Não',
        observacao: p.observacao,
        referencia: p.referencia
      });
    });
    return view;
  }

  trocarPagina() {
    this.obter(this.ultimoFiltro);
  }



}
