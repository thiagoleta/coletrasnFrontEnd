import { ManterComponent } from '../manter/manter.component';
import { Component, OnInit } from '@angular/core';
import { Material } from 'src/app/models/material.model';
import { ColunaGenerica } from 'src/app/models/coluna-generica.model';
import { MaterialService } from 'src/app/services/material.service';
import { DialogService } from 'src/app/services/dialog.service';
import { HttpErrorResult } from '../../http/http-error-result';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
})
export class ConsultaComponent implements OnInit {

  access_token = '';
  titulo: string = 'Material';
  breadcrump: string = 'Cadastros > Material';
  tituloLista: string = 'Material';
  tituloAdicionar: string = 'Adicionar Material';
  pagina: number = 1;
  ordenacaoColuna: string = '';
  ordenacaoDirecao: 'asc' | 'desc' = 'asc';
  totalDeRegistrosPorPagina: number = 8;
  registros: Array<Material>;
  totalDeRegistros: number;
  modal: any = ManterComponent;
  colunas: Array<ColunaGenerica> = [
    new ColunaGenerica('ID', 'cod_Material', true, '7%', 'cod_Material'),
    new ColunaGenerica('Descrição', 'descricao', true, '30%', 'descricao'),
    new ColunaGenerica('Material Coletado', 'material_Coletado',  true, '27%', 'material_Coletado'),
    new ColunaGenerica('Observação', 'observacao', true, '50%', 'observacao' ),
    new ColunaGenerica('Volume', 'volume', true, '7%', 'volume'),
  ];


  constructor(private service: MaterialService,
              private dialog: DialogService ) { }

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
      const resultado = await ManterComponent.exibeModalDeCriar();
      console.log(resultado);
    } catch (error) {
      console.error(error);
    }
    await this.obter();
  }

  async abrirDialogoDeAtualizar(cod_Material: number): Promise<void> {
    const entidade: Material = this.registros.find(x => x.cod_Material === cod_Material);
    try {
      await ManterComponent.exibeModalDeAlterar(entidade);
    } catch (error) {
      console.error(error);
    }
    await this.obter();
  }



  async remover(cod_Material: number): Promise<void> {
    const confirm = await this.dialog.showConfirm('Excluir Material', 'Deseja excluir o Material?');
    if (confirm) {
      try {
        await this.service.remover(cod_Material);
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
      this.registros.forEach((m: Material) => {
        view.push({
          cod_Material: m.cod_Material,
          descricao: m.descricao,
          volume: m.volume,
          observacao: m.observacao,
          material_Coletado: m.material_Coletado,
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


