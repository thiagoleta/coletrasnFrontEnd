import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Pagamento } from 'src/app/models/pagamento.model';
import { ClienteService } from 'src/app/services/cliente.service';
import { DialogService } from 'src/app/services/dialog.service';
import { MesreferenciaService } from 'src/app/services/mesreferencia.service';
import { PagamentoService } from 'src/app/services/pagamento.service';
import { StaticInjector } from 'src/app/services/static-injector';
import { HttpErrorResult } from 'src/app/views/http/http-error-result';

@Component({
  selector: 'app-pagamento-manter',
  templateUrl: './pagamento-manter.component.html',
  styleUrls: ['./pagamento-manter.component.css']
})
export class PagamentoManterComponent implements OnInit {

  @Input() titulo;
  @Input() entidade: Pagamento;

  

  clienteFormControl = new FormControl(null, [Validators.required]);
  mesRefFormControl = new FormControl(null, [Validators.required]);
  valorFormControl = new FormControl(null, [Validators.required]);
  dataPagamentoFormControl = new FormControl(null, [Validators.required]);
  

  formulario = new FormGroup({
    cliente: this.clienteFormControl,
    mesReferencia: this.mesRefFormControl,
    valor: this.valorFormControl,
    data: this.dataPagamentoFormControl,    
  });

  clientes: Array<any>;
  mesReferenciaList: Array<any>;

  constructor(
    public activeModal: NgbActiveModal,
    private service: PagamentoService,
    private dialog: DialogService,
    private clienteService: ClienteService,
    private mesRefService: MesreferenciaService ) { }

    ngOnInit(): void {
      this.obterClientes();
      this.obterMesRef();      
      if (this.entidade) {
        this.clienteFormControl.setValue(this.entidade.cliente.cod_Cliente);
        this.mesRefFormControl.setValue(this.entidade.mesReferencia.cod_MesReferencia);
        this.valorFormControl.setValue(this.entidade.valor);
        this.dataPagamentoFormControl.setValue(this.entidade.data);         
  
      }
    }

      // tslint:disable-next-line: member-ordering
  private static exibeModal(): NgbModalRef {
    const modalService: NgbModal = StaticInjector.Instance.get(NgbModal);
    const modalRef = modalService.open(PagamentoManterComponent, { centered: true, backdrop: 'static' });
    return modalRef;
  } 




  // tslint:disable-next-line: member-ordering
  public static async exibeModalDeCriar(): Promise<void> {
    const modalRef = this.exibeModal();
    modalRef.componentInstance.titulo = 'Inclusão de Pagamento';    
    await modalRef.result;
  }

  // tslint:disable-next-line: member-ordering
  public static async exibeModalDeAlterar(entidade: Pagamento): Promise<void> {
    const modalRef = this.exibeModal();
    modalRef.componentInstance.titulo = 'Edição de Pagamento';
    modalRef.componentInstance.entidade = entidade;
    await modalRef.result;
  }



  async onSubmit() {
    this.formulario.markAllAsTouched();
    if (this.formulario.invalid) {
      return false;
    }
    try {
      if (this.entidade) {
        await this.atualizar();
      } else {
        await this.criar();
      }
      this.activeModal.dismiss();
    } catch (error) {
      console.error(error);
    }
  }
  

    private async criar(): Promise<void> {
      try {
        await this.service.criarPagamento({
          cod_Cliente: this.clienteFormControl.value ? this.clienteFormControl.value : null,
          cod_MesReferencia: this.mesRefFormControl.value ? this.mesRefFormControl.value : null,
          valor: this.valorFormControl.value ? this.valorFormControl.value : 0,
          data: this.dataPagamentoFormControl.value,          
        });
        this.dialog.showAlert('Cadastro realizado com sucesso', 'O Pagamento foi registrado no sistema.')
        .then(() => this.activeModal.close(this.entidade));
      } catch (error) {
        this.dialog.showErr('Cadastro não realizado', (error as HttpErrorResult).messages.join('\n'));
        throw error;
      }
    }
  
    private async atualizar(): Promise<void> {
      try {
        await this.service.atualizarPagamento({
          cod_Pagamento: this.entidade.cod_Pagamento,
          cod_Cliente: this.clienteFormControl.value,
          cod_MesReferencia: this.mesRefFormControl.value,
          valor: this.valorFormControl.value,
          data: this.dataPagamentoFormControl.value ? this.dataPagamentoFormControl.value : null,          
          
        });
        this.dialog.showAlert('Alteração realizada com sucesso', 'O Pagamento foi alterado no sistema.')
        .then(() => this.activeModal.close(this.entidade));
      } catch (error) {
        this.dialog.showErr('Alteração não realizada', (error as HttpErrorResult).messages.join('\n'));
        throw error;
      }
    }
  
    async obterClientes() {
      try {      
        const clientesServico = await this.clienteService.obter();        
        this.clientes = clientesServico.map((cliente: any) =>  ({ cod_Cliente: cliente.cod_Cliente, nomeCompleto_RazaoSocial: cliente.nomeCompleto_RazaoSocial.toUpperCase()}));   
      } catch (error) {
        await this.dialog.showErr('Erro ao obter Clientes', (error as HttpErrorResult).messages.join('\n'));
      }
    }

    async obterMesRef() {
      try {      
        const mesRefServico = await this.mesRefService.obter();        
        this.mesReferenciaList = mesRefServico.map((mesRef: any) =>  ({ cod_MesReferencia: mesRef.cod_MesReferencia, mesAno: mesRef.mesAno.toUpperCase()}));           
      } catch (error) {
        await this.dialog.showErr('Erro ao obter Mes Referencia', (error as HttpErrorResult).messages.join('\n'));
      }
    }

         // tslint:disable-next-line: typedef
         desabilitaTooltip(formControl: FormControl) {
          return formControl.untouched || formControl.valid || formControl.disabled;
        }
}
