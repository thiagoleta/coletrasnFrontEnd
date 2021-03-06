import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Roteiro } from 'src/app/models/roteiro.model';
import { ClienteService } from 'src/app/services/cliente.service';
import { DialogService } from 'src/app/services/dialog.service';
import { MaterialService } from 'src/app/services/material.service';
import { MotoristaService } from 'src/app/services/motorista.service';
import { RotaService } from 'src/app/services/rota.service';
import { RoteiroService } from 'src/app/services/roteiro.service';
import { StaticInjector } from 'src/app/services/static-injector';
import { TurnoService } from 'src/app/services/turno.service';
import { HttpErrorResult } from 'src/app/views/http/http-error-result';



@Component({
  selector: 'app-roteiro-manter',
  templateUrl: './roteiro-manter.component.html',
  styleUrls: ['./roteiro-manter.component.css']
})
export class RoteiroManterComponent implements OnInit {

  @Input() titulo;
  @Input() entidade: Roteiro;

  clienteFormControl = new FormControl(null, [Validators.required]);
  turnoFormControl = new FormControl(null);
  rotaFormControl = new FormControl(null, [Validators.required]);
  motoristaFormControl =  new FormControl(null, [Validators.required]);
  materialFormControl = new FormControl(null, [Validators.required]);
  segudaFormControl = new FormControl(null);  
  tercaFormControl = new FormControl(null);
  quartaFormControl = new FormControl(null);
  quintaFormControl = new FormControl(null);
  sextaFormControl = new FormControl(null);
  sabadoFormControl = new FormControl(null);
  domingoFormControl = new FormControl(null);  
  observacaoFormControl = new FormControl(null, [Validators.required, Validators.maxLength(400)]);


  formulario = new FormGroup({
    cliente: this.clienteFormControl,
    turno: this.turnoFormControl,
    motorista: this.motoristaFormControl,
    rota: this.rotaFormControl,
    material: this.materialFormControl,
    segunda: this.segudaFormControl,
    terca: this.tercaFormControl,
    quarta: this.quartaFormControl,
    quinta: this.quintaFormControl,
    sexta: this.sextaFormControl,
    sabado: this.sabadoFormControl,
    domingo: this.domingoFormControl,
    observacao: this.observacaoFormControl
  });

clientes: Array<any>;
turnos: Array<any>;
motoristas: Array<any>;
rotas: Array<any>;
materiais: Array<any>;

  constructor(
    public activeModal: NgbActiveModal,
    private service: RoteiroService,
    private dialog: DialogService,
    private clienteService: ClienteService,
    private turnoService: TurnoService,
    private motoristaService: MotoristaService,
    private rotaService: RotaService,
    private materialService: MaterialService) { }

  ngOnInit(): void {
    this.obterClientes();
     this.obterTurnos();
     this.obterMotoristas();
     this.obterRotas();    
     this.obterMaterial();
    if (this.entidade) {
      this.clienteFormControl.setValue(this.entidade.cliente.cod_Cliente);
      this.turnoFormControl.setValue(this.entidade.turno.cod_Turno);
      this.rotaFormControl.setValue(this.entidade.rota.cod_Rota);
      this.motoristaFormControl.setValue(this.entidade.motorista.cod_Motorista);
      this.materialFormControl.setValue(this.entidade.material.cod_Material);
      this.segudaFormControl.setValue(this.entidade.segunda);
      this.tercaFormControl.setValue(this.entidade.terca);
      this.quartaFormControl.setValue(this.entidade.quarta);
      this.quintaFormControl.setValue(this.entidade.quinta);
      this.segudaFormControl.setValue(this.entidade.sexta );
      this.sabadoFormControl.setValue(this.entidade.sabado);
      this.domingoFormControl.setValue(this.entidade.domingo);
      this.observacaoFormControl.setValue(this.entidade.observacao);  

    }
  }



    // tslint:disable-next-line: member-ordering
    private static exibeModal(): NgbModalRef {
      const modalService: NgbModal = StaticInjector.Instance.get(NgbModal);
      const modalRef = modalService.open(RoteiroManterComponent, { centered: true, backdrop: 'static' });
      return modalRef;
    }
  
      // tslint:disable-next-line: member-ordering
  public static async exibeModalDeCriar(): Promise<void> {
    const modalRef = this.exibeModal();
    modalRef.componentInstance.titulo = 'Inclusão de Roteiro';
    await modalRef.result;
  }

    // tslint:disable-next-line: member-ordering
    public static async exibeModalDeAlterar(entidade: Roteiro): Promise<void> {
      const modalRef = this.exibeModal();
      modalRef.componentInstance.titulo = 'Edição de Roteiro';
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
      await this.service.criarRoteiro({
        cod_Cliente: this.clienteFormControl.value ? this.clienteFormControl.value : null,
        cod_Turno: this.turnoFormControl.value ? this.turnoFormControl.value : null,
        cod_Rota: this.rotaFormControl.value ? this.rotaFormControl.value : null,
        cod_Motorista: this.motoristaFormControl.value ? this.motoristaFormControl.value : null,
        cod_Material: this.materialFormControl.value ? this.materialFormControl.value : null,
        segunda: this.segudaFormControl.value,
        terca: this.tercaFormControl.value,
        quarta: this.quartaFormControl.value,
        quinta: this.quintaFormControl.value,
        sexta: this.sextaFormControl.value,
        sabado: this.sabadoFormControl.value,
        domingo: this.domingoFormControl.value,        
        observacao: this.observacaoFormControl.value,
      });
      this.dialog.showAlert('Cadastro realizado com sucesso', 'O Roteiro foi registrado no sistema.')
      .then(() => this.activeModal.close(this.entidade));
    } catch (error) {
      this.dialog.showErr('Cadastro não realizado', (error as HttpErrorResult).messages.join('\n'));
      throw error;
    }
  }



  private async atualizar(): Promise<void> {
    try {
      await this.service.atualizarRoteiro({
        cod_Roteiro: this.entidade.cod_Roteiro,
        cod_Cliente: this.clienteFormControl.value,
        cod_Turno: this.turnoFormControl.value ? this.turnoFormControl.value : null,
        cod_Rota: this.rotaFormControl.value ? this.rotaFormControl.value : null,
        cod_Motorista: this.motoristaFormControl.value ? this.motoristaFormControl.value : null,
        cod_Material: this.materialFormControl.value ? this.materialFormControl.value : null,
        segunda: this.segudaFormControl.value,
        terca: this.tercaFormControl.value,
        quarta: this.quartaFormControl.value,
        quinta: this.quintaFormControl.value,
        sexta: this.sextaFormControl.value,
        sabado: this.sabadoFormControl.value,
        domingo: this.domingoFormControl.value,
        observacao: this.observacaoFormControl.value,
      });
      this.dialog.showAlert('Alteração realizada com sucesso', 'O Roteiro foi alterado no sistema.')
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


  async obterTurnos() {
    try {
      const turnos = await this.turnoService.obter();       
      this.turnos = turnos.map((turno: any) =>  ({ cod_Turno: turno.cod_Turno, nome_Turno: turno.nome_Turno.toUpperCase()}));
    } catch (error) {
      await this.dialog.showErr('Erro ao obter Turnos', (error as HttpErrorResult).messages.join('\n'));
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

  async obterRotas() {
    try {
      const rotasServico = await this.rotaService.obter();       
      this.rotas = rotasServico.map((rota: any) =>  ({ cod_Rota: rota.cod_Rota, nome: rota.nome.toUpperCase()}));      
    } catch (error) {
      await this.dialog.showErr('Erro ao obter Rotas', (error as HttpErrorResult).messages.join('\n'));
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

}
