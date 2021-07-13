import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Os } from 'src/app/models/os.model';
import { ClienteService } from 'src/app/services/cliente.service';
import { DialogService } from 'src/app/services/dialog.service';
import { MaterialService } from 'src/app/services/material.service';
import { MesreferenciaService } from 'src/app/services/mesreferencia.service';
import { MotoristaService } from 'src/app/services/motorista.service';
import { OsService } from 'src/app/services/os.service';
import { StaticInjector } from 'src/app/services/static-injector';
import { HttpErrorResult } from 'src/app/views/http/http-error-result';

@Component({
  selector: 'app-os-manter',
  templateUrl: './os-manter.component.html',
  styleUrls: ['./os-manter.component.css']
})
export class OsManterComponent implements OnInit {

  @Input() titulo;
  @Input() entidade: Os;

  clienteFormControl = new FormControl(null, [Validators.required]);
  mesRefFormControl = new FormControl(null, [Validators.required]);
  motoristaFormControl = new FormControl(null, [Validators.required]);
  materialFormControl = new FormControl(null, [Validators.required]);
  quantidadeColetaAnoFormControl = new FormControl(null);
  dataColetaFormControl = new FormControl(null);  
  coletadoFlagFormControl = new FormControl(null);
  envioEmailFlagFormControl = new FormControl(null);
  canceladoFlagFormControl = new FormControl(null);
  motivoCancelamentoFormControl = new FormControl(null);
  dataCancelamentoFormControl = new FormControl(null);
  entradaFormControl = new FormControl(null);
  saidaFormControl = new FormControl(null);
  placaFormControl = new FormControl(null);



  formulario = new FormGroup({
    cliente: this.clienteFormControl,
    mesReferencia: this.mesRefFormControl,
    motorista: this.motoristaFormControl,
    material: this.materialFormControl,
    quantidade_Coletada: this.quantidadeColetaAnoFormControl,
    data_Coleta: this.dataColetaFormControl,
    flag_Coleta: this.coletadoFlagFormControl,
    flag_Envio_Email: this.envioEmailFlagFormControl,
    flag_Cancelado: this.canceladoFlagFormControl,
    motivo_Cancelamento: this.motivoCancelamentoFormControl,
    data_Cancelamento: this.dataCancelamentoFormControl,
    hora_Entrada: this.entradaFormControl,
    hora_Saida: this.saidaFormControl,
    placa: this.placaFormControl
  });

  clientes: Array<any>;
  mesReferenciaList: Array<any>;
  motoristas: Array<any>;  
  materiais: Array<any>;

  constructor( public activeModal: NgbActiveModal,
    private service: OsService,
    private dialog: DialogService,
    private clienteService: ClienteService,  
    private mesRefService: MesreferenciaService,      
    private motoristaService: MotoristaService,    
    private materialService: MaterialService) { }

    ngOnInit(): void {
      this.obterClientes();
       this.obterMesRef();
       this.obterMotoristas();         
       this.obterMaterial();
      if (this.entidade) {
        this.clienteFormControl.setValue(this.entidade.cliente.cod_Cliente);
        this.mesRefFormControl.setValue(this.entidade.mesReferencia.cod_MesReferencia);        
        this.motoristaFormControl.setValue(this.entidade.motorista.cod_Motorista);
        this.materialFormControl.setValue(this.entidade.material.cod_Material);
        this.quantidadeColetaAnoFormControl.setValue(this.entidade.quantidade_Coletada);
        this.dataColetaFormControl.setValue(this.entidade.data_Coleta);
        this.coletadoFlagFormControl.setValue(this.entidade.flag_Cancelado);
        this.envioEmailFlagFormControl.setValue(this.entidade.flag_Envio_Email);
        this.canceladoFlagFormControl.setValue(this.entidade.flag_Cancelado );
        this.motivoCancelamentoFormControl.setValue(this.entidade.motivo_Cancelamento);
        this.dataCancelamentoFormControl.setValue(this.entidade.data_Cancelamento);
        this.entradaFormControl.setValue(this.entidade.hora_Entrada);  
        this.saidaFormControl.setValue(this.entidade.hora_Saida);  
  
      }
    }
  

  private static exibeModal(): NgbModalRef {
    const modalService: NgbModal = StaticInjector.Instance.get(NgbModal);
    const modalRef = modalService.open(OsManterComponent, { centered: true, backdrop: 'static' });
    return modalRef;
  }

      // tslint:disable-next-line: member-ordering
      public static async exibeModalDeAlterar(entidade: Os): Promise<void> {
        const modalRef = this.exibeModal();
        modalRef.componentInstance.titulo = 'Edição de Ordem de Serviço';
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
      } 

      this.activeModal.dismiss();
    } catch (error) {
      console.error(error);
    }
  }

  private async atualizar(): Promise<void> {
    try {
      await this.service.atualizarOs({
        cod_OS: this.entidade.cod_OS,
        cod_Cliente: this.clienteFormControl.value,        
        cod_MesReferencia : this.mesRefFormControl.value ? this.mesRefFormControl.value : null,
        // cod_Rota: this.rotaFormControl.value ? this.rotaFormControl.value : null,
        cod_Material: this.materialFormControl.value ? this.materialFormControl.value : null,
        cod_Motorista: this.motoristaFormControl.value ? this.motoristaFormControl.value : null,
        quantidade_Coletada: this.quantidadeColetaAnoFormControl.value ? this.motoristaFormControl.value : 0,
        data_Coleta: this.dataColetaFormControl.value ? this.dataColetaFormControl.value : null,
        flag_Coleta: this.coletadoFlagFormControl.value,
        flag_Envio_Email: this.envioEmailFlagFormControl.value,
        flag_Cancelado: this.canceladoFlagFormControl.value,
        motivo_Cancelamento: this.motivoCancelamentoFormControl.value ? this.motivoCancelamentoFormControl.value : null,
        data_Cancelamento: this.dataCancelamentoFormControl.value ? this.motivoCancelamentoFormControl.value : null,
        hora_Entrada: this.entradaFormControl.value ? this.entradaFormControl.value : null,
        hora_Saida: this.saidaFormControl.value ? this.saidaFormControl.value : null,
      });
      this.dialog.showAlert('Alteração realizada com sucesso', 'A Ordem de Serviço foi alterada no sistema.')
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

  async obterMotoristas () {
    try {
      const motoristasDoServico = await this.motoristaService.obter();
      this.motoristas = motoristasDoServico.map((motorista: any)=> ({cod_Motorista: motorista.cod_Motorista, nome: motorista.nome.toUpperCase()}));
    } catch (error) {
      await this.dialog.showErr('Erro ao obter Motoristas', (error as HttpErrorResult).messages.join('\n'));    
    }
  }

  async obterMaterial() {
    try {
      const materialServico = await this.materialService.obter();       
      this.materiais = materialServico.map((material: any) =>  ({ cod_Material: material.cod_Material, descricao: material.descricao.toUpperCase()}));       
    } catch (error) {
      await this.dialog.showErr('Erro ao obter Materiais', (error as HttpErrorResult).messages.join('\n'));
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

}
