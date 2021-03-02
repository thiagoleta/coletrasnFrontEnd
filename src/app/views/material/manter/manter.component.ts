import { Component, Input, OnInit } from '@angular/core';
import { Material } from 'src/app/models/material.model';
import { NgbActiveModal, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService } from 'src/app/services/dialog.service';
import { HttpErrorResult } from 'src/app/views/http/http-error-result';
import { MaterialService } from 'src/app/services/material.service';
import { StaticInjector } from 'src/app/services/static-injector';


@Component({
  selector: 'app-manter',
  templateUrl: './manter.component.html'
})
export class ManterComponent implements OnInit {

  @Input() titulo;
  @Input() entidade: Material;

  
  mascaraCpf = [/[0-9]/, /[0-9]/, /[0-9]/];


  descricaoFormControl = new FormControl(null, [Validators.required, Validators.maxLength(200)]);
  volumeFormControl = new FormControl();
  observacaoFormControl = new FormControl();
  materialColetadoFormControl = new FormControl();


  formulario = new FormGroup({
    descricao: this.descricaoFormControl,
    volume: this.volumeFormControl,
    observacao: this.observacaoFormControl,
    materialColetado: this.materialColetadoFormControl
  });


  constructor(
    public activeModal: NgbActiveModal,
    private service: MaterialService,
    private dialog: DialogService) { }

  ngOnInit(): void {
    if (this.entidade) {
      this.descricaoFormControl.setValue(this.entidade.descricao);
      this.volumeFormControl.setValue(this.entidade.volume);
      this.observacaoFormControl.setValue(this.entidade.observacao);
      this.materialColetadoFormControl.setValue(this.entidade.material_Coletado);
    }
  }

  // tslint:disable-next-line: member-ordering
  private static exibeModal(): NgbModalRef {
    const modalService: NgbModal = StaticInjector.Instance.get(NgbModal);
    const modalRef = modalService.open(ManterComponent, { centered: true, backdrop: 'static' });
    return modalRef;
  }


  // tslint:disable-next-line: member-ordering
  public static async exibeModalDeCriar(): Promise<void> {
    const modalRef = this.exibeModal();
    modalRef.componentInstance.titulo = 'Inclusão de Material';
    await modalRef.result;
  }

  // tslint:disable-next-line: member-ordering
  public static async exibeModalDeAlterar(entidade: Material): Promise<void> {
    const modalRef = this.exibeModal();
    modalRef.componentInstance.titulo = 'Edição de Material';
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
      await this.service.criarMaterial({
        descricao: this.descricaoFormControl.value,
        volume: this.volumeFormControl.value,
        observacao: this.observacaoFormControl.value,
        material_Coletado: this.materialColetadoFormControl.value
      });
      this.dialog.showAlert('Cadastro realizado com sucesso', 'O Material foi registrado no sistema.')
      .then(() => this.activeModal.close(this.entidade));
    } catch (error) {
      this.dialog.showErr('Cadastro não realizado', (error as HttpErrorResult).messages.join('\n'));
      throw error;
    }
  }

  private async atualizar(): Promise<void> {
    try {
      await this.service.atualizarMaterial({
        cod_Material: this.entidade.cod_Material,
        descricao: this.descricaoFormControl.value,
        volume: this.volumeFormControl.value,
        observacao: this.observacaoFormControl.value,
        material_coletado: this.materialColetadoFormControl.value
      });
      this.dialog.showAlert('Alteração realizada com sucesso', 'O Material foi alterado no sistema.')
      .then(() => this.activeModal.close(this.entidade));
    } catch (error) {
      this.dialog.showErr('Alteração não realizada', (error as HttpErrorResult).messages.join('\n'));
      throw error;
    }
  }

}


