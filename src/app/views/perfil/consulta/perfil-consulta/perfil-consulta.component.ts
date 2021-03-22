import { Component, OnInit } from '@angular/core';
import { ColunaGenerica } from 'src/app/models/coluna-generica.model';
import { Perfil } from 'src/app/models/perfil.model';
import { DialogService } from 'src/app/services/dialog.service';
import { PerfilService } from 'src/app/services/perfil.service';
import { HttpErrorResult } from 'src/app/views/http/http-error-result';
import { PerfilManterComponent } from '../../manter/perfil-manter/perfil-manter.component';

@Component({
  selector: 'app-perfil-consulta',
  templateUrl: './perfil-consulta.component.html',
  styleUrls: ['./perfil-consulta.component.css']
})
export class PerfilConsultaComponent implements OnInit {

  titulo: string = 'Perfil';
  breadcrump: string = 'Cadastros > Perfil';
  tituloLista: string = 'Roteiro';
  tituloAdicionar: string = 'Adicionar Perfil';
  pagina: number = 1;
  ordenacaoColuna: string = '';
  ordenacaoDirecao: 'asc' | 'desc' = 'asc';
  totalDeRegistrosPorPagina: number = 8;
  registros: Array<Perfil>;
  totalDeRegistros: number;
  modal: any = PerfilManterComponent;
  colunas: Array<ColunaGenerica> = [
    new ColunaGenerica('ID', 'cod_Perfil', true, '2%', 'cod_Perfil'),
    new ColunaGenerica('Nome Perfil', 'nome_Perfil', true, '30%', 'nome_Perfil'),
    
  ];
  

  constructor(
    private service: PerfilService,
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
      const resultado = await PerfilManterComponent.exibeModalDeCriar();
      console.log(resultado);
    } catch (error) {
      console.error(error);
    }
    await this.obter();
  }

  async abrirDialogoDeAtualizar(cod_Perfil: number): Promise<void> {
    const entidade: Perfil = this.registros.find(x => x.cod_Perfil === cod_Perfil);
    try {
      await PerfilManterComponent.exibeModalDeAlterar(entidade);
    } catch (error) {
      console.error(error);
    }
    await this.obter();
  }

  async remover(cod_Perfil: number): Promise<void> {
    const confirm = await this.dialog.showConfirm('Excluir Perfil', 'Deseja excluir o Perfil?');
    if (confirm) {
      try {
        await this.service.remover(cod_Perfil);
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
      this.registros.forEach((m: Perfil) => {
        view.push({
          cod_Perfil: m.cod_Perfil,
          nome_Perfil: m.nome_Perfil,     
                    
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
