import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { MesReferencia } from 'src/app/models/mesreferencia.model';
import { DialogService } from 'src/app/services/dialog.service';
import { MesreferenciaService } from 'src/app/services/mesreferencia.service';
import { StaticInjector } from 'src/app/services/static-injector';
import { HttpErrorResult } from 'src/app/views/http/http-error-result';

@Component({
  selector: 'app-mesreferencia-manter',
  templateUrl: './mesreferencia-manter.component.html',
  styleUrls: ['./mesreferencia-manter.component.css']
})
export class MesreferenciaManterComponent implements OnInit {

  @Input() titulo;
  @Input() entidade: MesReferencia;



  mesAnoFormControl = new FormControl(null, [Validators.required]);
  dataInicioFormControl = new FormControl(null, [Validators.required]);
  dataInicioTerminoFormControl = new FormControl(null);
  ativoFormControl = new FormControl(null);


  formulario = new FormGroup({
    mesAno: this.mesAnoFormControl,
    dataInicio: this.dataInicioFormControl,
    dataTermino: this.dataInicioTerminoFormControl,
    ativo: this.ativoFormControl
  });


  constructor(public activeModal: NgbActiveModal,
    private service: MesreferenciaService,
    private dialog: DialogService) { }


  ngOnInit(): void {
    if (this.entidade) {
      this.mesAnoFormControl.setValue(this.entidade.mesAno);
      this.dataInicioFormControl.setValue(this.entidade.dataInicio ? new Date(this.entidade.dataInicio) : null);
      this.dataInicioTerminoFormControl.setValue(this.entidade.dataTermino ? new Date(this.entidade.dataTermino) : null);
      this.ativoFormControl.setValue(this.entidade.ativo);
    }
  }


    // tslint:disable-next-line: member-ordering
    private static exibeModal(): NgbModalRef {
      const modalService: NgbModal = StaticInjector.Instance.get(NgbModal);
      const modalRef = modalService.open(MesreferenciaManterComponent, { centered: true, backdrop: 'static' });
      return modalRef;
    }
  
      // tslint:disable-next-line: member-ordering
  public static async exibeModalDeCriar(): Promise<void> {
    const modalRef = this.exibeModal();
    modalRef.componentInstance.titulo = 'Inclusão do Mês Referência';
    await modalRef.result;
  }

    // tslint:disable-next-line: member-ordering
    public static async exibeModalDeAlterar(entidade: MesReferencia): Promise<void> {
      const modalRef = this.exibeModal();
      modalRef.componentInstance.titulo = 'Edição do Mês Referência';
      modalRef.componentInstance.entidade = entidade;
      await modalRef.result;
    }
  
    
   // tslint:disable-next-line: typedef
   desabilitaTooltip(formControl: FormControl) {
    return formControl.untouched || formControl.valid;
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
      await this.service.criarMesRef({
        mesAno: this.mesAnoFormControl.value,
        dataInicio: this.dataInicioFormControl.value ? this.dataInicioFormControl.value : null,
        dataTermino: this.dataInicioTerminoFormControl.value ? this.dataInicioTerminoFormControl.value : null,
        ativo: this.ativoFormControl.value
      });
      this.dialog.showAlert('Cadastro realizado com sucesso', 'O Mês Referência foi registrado no sistema.')
      .then(() => this.activeModal.close(this.entidade));
    } catch (error) {
      this.dialog.showErr('Cadastro não realizado', (error as HttpErrorResult).messages.join('\n'));
      throw error;
    }
  }

  private async atualizar(): Promise<void> {
    try {
      await this.service.atualizarMesRef({
        cod_MesReferencia: this.entidade.cod_MesReferencia,
        mesAno: this.mesAnoFormControl.value,
        dataInicio:  this.dataInicioFormControl.value ? this.dataInicioFormControl.value : null,
        dataTermino: this.dataInicioTerminoFormControl.value ? this.dataInicioTerminoFormControl.value : null,
        ativo: this.ativoFormControl.value        
      });
      this.dialog.showAlert('Alteração realizada com sucesso', 'O Mês Referência foi alterado no sistema.')
      .then(() => this.activeModal.close(this.entidade));
    } catch (error) {
      this.dialog.showErr('Alteração não realizada', (error as HttpErrorResult).messages.join('\n'));
      throw error;
    }
  }

}
