import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Rota } from 'src/app/models/rota.model';
import { DialogService } from 'src/app/services/dialog.service';
import { MotoristaService } from 'src/app/services/motorista.service';
import { RotaService } from 'src/app/services/rota.service';
import { StaticInjector } from 'src/app/services/static-injector';
import { HttpErrorResult } from 'src/app/views/http/http-error-result';

@Component({
  selector: 'app-rota-manter',
  templateUrl: './rota-manter.component.html',
  styleUrls: ['./rota-manter.component.css']
})
export class RotaManterComponent implements OnInit {

  @Input() titulo;
  @Input() entidade: Rota;

  nomeFormControl = new FormControl(null, [Validators.required, Validators.maxLength(200)]);
  composicaoRotaFormControl = new FormControl();
  ativoAdcinalFormControl: FormControl = new FormControl();  
  observacaoFormControl = new FormControl();


  formulario = new FormGroup({
    nome: this.nomeFormControl,
    composicao_rota: this.composicaoRotaFormControl,
    flag_Ativo: this.ativoAdcinalFormControl,
    observacao: this.observacaoFormControl,
  });


  constructor(
    public activeModal: NgbActiveModal,
    private service: RotaService,
    private dialog: DialogService) { }

  ngOnInit(): void {
    if (this.entidade) {
      this.nomeFormControl.setValue(this.entidade.nome);
      this.composicaoRotaFormControl.setValue(this.entidade.composicao_Rota);
      this.ativoAdcinalFormControl.setValue(this.entidade.flag_Ativo);
      this.observacaoFormControl.setValue(this.entidade.observacao);

    }
  }

  // tslint:disable-next-line: member-ordering
  private static exibeModal(): NgbModalRef {
    const modalService: NgbModal = StaticInjector.Instance.get(NgbModal);
    const modalRef = modalService.open(RotaManterComponent, { centered: true, backdrop: 'static' });
    return modalRef;
  }

  // tslint:disable-next-line: member-ordering
  public static async exibeModalDeCriar(): Promise<void> {
    const modalRef = this.exibeModal();
    modalRef.componentInstance.titulo = 'Inclusão de Rota';
    await modalRef.result;
  }

  // tslint:disable-next-line: member-ordering
  public static async exibeModalDeAlterar(entidade: Rota): Promise<void> {
    const modalRef = this.exibeModal();
    modalRef.componentInstance.titulo = 'Edição de Rota';
    modalRef.componentInstance.entidade = entidade;
    await modalRef.result;
  }


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
      await this.service.criarRota({
        nome: this.nomeFormControl.value,
        composicao_Rota: this.composicaoRotaFormControl.value,
        flag_Ativo: this.ativoAdcinalFormControl.value,
        observacao: this.observacaoFormControl.value
      });
      this.dialog.showAlert('Cadastro realizado com sucesso', 'A Rota foi registrada no sistema.')
        .then(() => this.activeModal.close(this.entidade));
    } catch (error) {
      this.dialog.showErr('Cadastro não realizado', (error as HttpErrorResult).messages.join('\n'));
      throw error;
    }
  }

  private async atualizar(): Promise<void> {
    try {
      await this.service.atualizarRota({
        cod_Rota: this.entidade.cod_Rota,
        nome: this.nomeFormControl.value,
        composicao_Rota: this.composicaoRotaFormControl.value,
        flag_Ativo: this.ativoAdcinalFormControl.value,
        observacao: this.observacaoFormControl.value
      });
      this.dialog.showAlert('Alteração realizada com sucesso', 'A Rota foi alterada no sistema.')
        .then(() => this.activeModal.close(this.entidade));
    } catch (error) {
      this.dialog.showErr('Alteração não realizada', (error as HttpErrorResult).messages.join('\n'));
      throw error;
    }
  }

  

}