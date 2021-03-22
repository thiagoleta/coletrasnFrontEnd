import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Contrato } from 'src/app/models/contrato.model';
import { ClienteService } from 'src/app/services/cliente.service';
import { ContratoService } from 'src/app/services/contrato.service';
import { DialogService } from 'src/app/services/dialog.service';
import { StaticInjector } from 'src/app/services/static-injector';
import { HttpErrorResult } from 'src/app/views/http/http-error-result';

@Component({
  selector: 'app-contrato-manter',
  templateUrl: './contrato-manter.component.html',
  styleUrls: ['./contrato-manter.component.css']
})
export class ContratoManterComponent implements OnInit {

  @Input() titulo;
  @Input() entidade: Contrato;

  

  clienteFormControl = new FormControl(null, [Validators.required]);
  coletaContratadaFormControl = new FormControl(null, [Validators.required]);
  valorLimiteFormControl = new FormControl(null);
  valorUnidadeFormControl =  new FormControl(null, [Validators.required]);
  dataInicioContratoFormControl = new FormControl(null);  
  motivoCancelamentoFormControl = new FormControl(null);
  dataCancelamentoFormControl = new FormControl(null);  
  flagTerminoFormControl = new FormControl(null);
  dataTerminoFormControl = new FormControl(null);
  

  formulario = new FormGroup({
    cliente: this.clienteFormControl,
    coletaContratada: this.coletaContratadaFormControl,
    valorLimite: this.valorLimiteFormControl,
    valorUnidade: this.valorUnidadeFormControl,
    dataInicio: this.dataInicioContratoFormControl,
    motivoCancelamento: this.motivoCancelamentoFormControl,
    flagTermino: this.flagTerminoFormControl,
    dataTermino: this.dataTerminoFormControl,    
  });

  clientes: Array<any>;

  constructor(
    public activeModal: NgbActiveModal,
    private service: ContratoService,
    private dialog: DialogService,
    private clienteService: ClienteService ) { }

  ngOnInit(): void {
    this.obterClientes();
    if (this.entidade) {
      this.clienteFormControl.setValue(this.entidade.cliente.cod_Cliente);
      this.coletaContratadaFormControl.setValue(this.entidade.coletaContratada);
      this.valorLimiteFormControl.setValue(this.entidade.valorLimite);
      this.valorUnidadeFormControl.setValue(this.entidade.valorUnidade);
      this.dataInicioContratoFormControl.setValue(this.entidade.dataInicio);
      this.dataInicioContratoFormControl.setValue(this.entidade.dataInicio);
      this.motivoCancelamentoFormControl.setValue(this.entidade.motivoCancelamento);
      this.flagTerminoFormControl.setValue(this.entidade.flagTermino);
      this.dataTerminoFormControl.setValue(this.entidade.dataTermino);

    }
  }
  
  // tslint:disable-next-line: member-ordering
  private static exibeModal(): NgbModalRef {
    const modalService: NgbModal = StaticInjector.Instance.get(NgbModal);
    const modalRef = modalService.open(ContratoManterComponent, { centered: true, backdrop: 'static' });
    return modalRef;
  }


  
        // tslint:disable-next-line: member-ordering
        public static async exibeModalDeCriar(): Promise<void> {
          const modalRef = this.exibeModal();
          modalRef.componentInstance.titulo = 'Inclusão de Contrato';
          await modalRef.result;
        }


   // tslint:disable-next-line: member-ordering
   public static async exibeModalDeAlterar(entidade: Contrato): Promise<void> {
    const modalRef = this.exibeModal();
    modalRef.componentInstance.titulo = 'Edição de Contrato';
    modalRef.componentInstance.entidade = entidade;
    await modalRef.result;
  }
      
   // tslint:disable-next-line: typedef
   desabilitaTooltip(formControl: FormControl) {
    return formControl.untouched || formControl.valid || formControl.disabled;
  }


  async onSubmit() {
    this.formulario.markAllAsTouched();
    if (this.formulario.invalid) {
      return;
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
      await this.service.criarContrato({
        cod_Cliente: this.clienteFormControl.value ? this.clienteFormControl.value : null,
        coletaContratada: this.coletaContratadaFormControl.value,        
        valorLimite: this.valorLimiteFormControl.value ? this.valorLimiteFormControl.value : 0,
        valorUnidade: this.valorUnidadeFormControl.value,
        dataInicio: this.dataInicioContratoFormControl.value,        
        motivoCancelamento: this.motivoCancelamentoFormControl.value ? this.motivoCancelamentoFormControl.value : null,        
        dataCancelamento: this.dataCancelamentoFormControl.value ? this.dataCancelamentoFormControl.value : null,        
        flagTermino: this.flagTerminoFormControl.value ? this.flagTerminoFormControl.value : null,        
        dataTermino: this.dataTerminoFormControl.value ? this.dataTerminoFormControl.value : null,                
      });
      this.dialog.showAlert('Cadastro realizado com sucesso', 'O Contrato foi registrado no sistema.')
      .then(() => this.activeModal.close(this.entidade));
    } catch (error) {
      this.dialog.showErr('Cadastro não realizado', (error as HttpErrorResult).messages.join('\n'));
      throw error;
    }
  }

  private async atualizar(): Promise<void> {
    try {
      await this.service.atualizarContrato({
        cod_Contrato: this.entidade.cod_Contrato,
        cod_Cliente: this.clienteFormControl.value,
        coletaContratada: this.coletaContratadaFormControl.value ? this.coletaContratadaFormControl.value : null,
        valorLimite: this.valorLimiteFormControl.value ? this.valorLimiteFormControl.value : null,
        valorUnidade: this.valorUnidadeFormControl.value ? this.valorUnidadeFormControl.value : null,
        dataInicio: this.dataInicioContratoFormControl.value ? this.dataInicioContratoFormControl.value : null,
        motivoCancelamento: this.motivoCancelamentoFormControl.value ? this.motivoCancelamentoFormControl.value : null,
        dataCancelamento: this.dataCancelamentoFormControl.value ? this.dataCancelamentoFormControl.value : null,
        flagTermino: this.flagTerminoFormControl.value ? this.flagTerminoFormControl.value : null,      
        dataTermino: this.dataCancelamentoFormControl.value ? this.dataCancelamentoFormControl.value : null,
        
      });
      this.dialog.showAlert('Alteração realizada com sucesso', 'O Contrato foi alterado no sistema.')
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



}
