import { Component, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ColunaGenerica } from 'src/app/models/coluna-generica.model';
import { Roteiro } from 'src/app/models/roteiro.model';
import { DialogService } from 'src/app/services/dialog.service';
import { RoteiroService } from 'src/app/services/roteiro.service';
import { HttpErrorResult } from 'src/app/views/http/http-error-result';
import { RoteiroManterComponent } from '../../manter/roteiro-manter/roteiro-manter.component';

@Component({
  selector: 'app-roteiro-consulta',
  templateUrl: './roteiro-consulta.component.html',
  styleUrls: ['./roteiro-consulta.component.css']
})
export class RoteiroConsultaComponent implements OnInit { 


  titulo: string = 'Roteiro';
  breadcrump: string = 'Cadastro > Roteiro';
  tituloLista: string = 'Roteiro';
  tituloAdicionar: string = 'Adicionar Roteiro';
  pagina: number = 1;
  ordenacaoColuna: string = '';
  ordenacaoDirecao: 'asc' | 'desc' = 'asc';
  totalDeRegistrosPorPagina: number = 8;
  registros: Array<Roteiro>;
  totalDeRegistros: number;
  modal: any = RoteiroManterComponent;
  colunas: Array<ColunaGenerica> = [
    new ColunaGenerica('ID', 'cod_Roteiro', true, '2%', 'cod_Roteiro'),
    new ColunaGenerica('Cliente', 'cliente', true, '20%', 'cliente'),
    new ColunaGenerica('Rota', 'rota', true, '2%', 'rota'),
    new ColunaGenerica('Turno', 'turno', true, '2%', 'turno'),
    new ColunaGenerica('Endereço', 'endereco', true, '20%', 'endereco'),
    new ColunaGenerica('Motorista', 'motorista', true, '10%', 'motorista'),
    new ColunaGenerica('Seg', 'segunda', true, '5%', 'segunda'),
    new ColunaGenerica('Ter', 'terca', true, '5%', 'terca'),
    new ColunaGenerica('Qua', 'quarta', true, '5%', 'quarta'),
    new ColunaGenerica('Qui', 'quinta', true, '5%', 'quinta'),
    new ColunaGenerica('Sex', 'sexta', true, '5%', 'sexta'),
    new ColunaGenerica('Sab', 'sabado', true, '5%', 'sabado'),
    new ColunaGenerica('Dom', 'domingo', true, '5%', 'domingo'),
    
  ];
  

  constructor(
    private service: RoteiroService,
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
      const resultado = await RoteiroManterComponent.exibeModalDeCriar();
      console.log(resultado);
    } catch (error) {
      console.error(error);
    }
    await this.obter();
  }

  async abrirDialogoDeAtualizar(cod_Roteiro: number): Promise<void> {
    const entidade: Roteiro = this.registros.find(x => x.cod_Roteiro === cod_Roteiro);
    try {
      await RoteiroManterComponent.exibeModalDeAlterar(entidade);
    } catch (error) {
      console.error(error);
    }
    await this.obter();
  }

  
  async remover(cod_Roteiro: number): Promise<void> {
    const confirm = await this.dialog.showConfirm('Excluir Roteiro', 'Deseja excluir o Roteiro?');
    if (confirm) {
      try {
        await this.service.remover(cod_Roteiro);
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
      this.registros.forEach((m: Roteiro) => {
        view.push({
          cod_Roteiro: m.cod_Roteiro,
          rota: m.rota.nome, 
          cliente: m.cliente.nomeCompleto_RazaoSocial,
          turno: m.turno.nome_Turno,
          motorista: m.motorista.nome,
          endereco: m.cliente.endereco,          
          segunda: m.segunda == true ?'Sim' : 'Não',
          terca: m.terca == true ?'Sim' : 'Não',
          quarta: m.quarta == true ?'Sim' : 'Não',
          quinta: m.quinta == true ?'Sim' : 'Não',
          sexta: m.sexta == true ?'Sim' : 'Não',
          sabado: m.sabado == true ?'Sim' : 'Não',
          domingo: m.domingo == true ?'Sim' : 'Não',
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
