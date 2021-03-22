import { Component, OnInit } from '@angular/core';
import { ColunaGenerica } from 'src/app/models/coluna-generica.model';
import { Usuario } from 'src/app/models/usuario.model';
import { DialogService } from 'src/app/services/dialog.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { HttpErrorResult } from 'src/app/views/http/http-error-result';
import { UsuarioManterComponent } from '../../manter/usuario-manter/usuario-manter.component';

@Component({
  selector: 'app-usuario-consulta',
  templateUrl: './usuario-consulta.component.html',
  styleUrls: ['./usuario-consulta.component.css']
})
export class UsuarioConsultaComponent implements OnInit {

  titulo: string = 'Usuário';
  breadcrump: string = 'Cadastros > Usuário';
  tituloLista: string = 'Roteiro';
  tituloAdicionar: string = 'Adicionar Usuário';
  pagina: number = 1;
  ordenacaoColuna: string = '';
  ordenacaoDirecao: 'asc' | 'desc' = 'asc';
  totalDeRegistrosPorPagina: number = 8;
  registros: Array<Usuario>;
  totalDeRegistros: number;
  modal: any = UsuarioManterComponent;
  colunas: Array<ColunaGenerica> = [
    new ColunaGenerica('ID', 'cod_Usuario', true, '2%', 'cod_Usuario'),
    new ColunaGenerica('Nome Usuário', 'nome', true, '30%', 'nome'),
    new ColunaGenerica('Email', 'email', true, '2%', 'email'),
    new ColunaGenerica('Perfil', 'perfil', true, '2%', 'perfil'),
    new ColunaGenerica('Senha', 'senha', true, '10%', 'senha'),
    
  ];
  


  constructor(
    private service: UsuarioService,
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
      const resultado = await UsuarioManterComponent.exibeModalDeCriar();
      console.log(resultado);
    } catch (error) {
      console.error(error);
    }
    await this.obter();
  }

  async abrirDialogoDeAtualizar(cod_Usuario: number): Promise<void> {
    const entidade: Usuario = this.registros.find(x => x.cod_Usuario === cod_Usuario);
    try {
      await UsuarioManterComponent.exibeModalDeAlterar(entidade);
    } catch (error) {
      console.error(error);
    }
    await this.obter();
  }

    
  async remover(cod_Usuario: number): Promise<void> {
    const confirm = await this.dialog.showConfirm('Excluir Usuário', 'Deseja excluir o Usuário?');
    if (confirm) {
      try {
        await this.service.remover(cod_Usuario);
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
      this.registros.forEach((m: Usuario) => {
        view.push({
          cod_Usuario: m.cod_Usuario,
          nome: m.nome, 
          email: m.email,
          perfil: m.perfil.nome_Perfil,
          senha: m.senha,          
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
