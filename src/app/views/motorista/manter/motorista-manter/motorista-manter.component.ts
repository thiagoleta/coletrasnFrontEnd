import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService } from 'src/app/services/dialog.service';
import { HttpErrorResult } from 'src/app/views/http/http-error-result';
import { StaticInjector } from 'src/app/services/static-injector';
import { Motorista } from 'src/app/models/motorista.model';
import { MotoristaService } from 'src/app/services/motorista.service';

@Component({
  selector: 'app-motorista-manter',
  templateUrl: './motorista-manter.component.html',
  styleUrls: ['./motorista-manter.component.css']
})
export class MotoristaManterComponent implements OnInit {

  @Input() titulo;
  @Input() entidade: Motorista;

  nomeFormControl = new FormControl(null, [Validators.required, Validators.maxLength(200)]);
  telefone1FormControl = new FormControl();
  telefoneAdcinalFormControl = new FormControl();
  ajudante1FormControl = new FormControl();
  ajudanteAdcianalFormControl = new FormControl();
  placaFormControl = new FormControl(null, [Validators.required, Validators.maxLength(100)]);


  formulario = new FormGroup({
    nome: this.nomeFormControl,
    telefone1: this.telefone1FormControl,
    telefone2: this.telefoneAdcinalFormControl,
    ajudante1: this.ajudante1FormControl,
    ajudante2: this.ajudanteAdcianalFormControl,
    placa: this.placaFormControl,
  });

  constructor(
    public activeModal: NgbActiveModal,
    private service: MotoristaService,
    private dialog: DialogService) { }

    ngOnInit(): void {
      if (this.entidade) {
        this.nomeFormControl.setValue(this.entidade.nome);
        this.ajudante1FormControl.setValue(this.entidade.ajudante1);
        this.ajudanteAdcianalFormControl.setValue(this.entidade.ajudante2);
        this.telefone1FormControl.setValue(this.entidade.telefone1);
        this.telefoneAdcinalFormControl.setValue(this.entidade.telefone2);
        this.placaFormControl.setValue(this.entidade.placa);
      }
    }


      // tslint:disable-next-line: member-ordering
  private static exibeModal(): NgbModalRef {
    const modalService: NgbModal = StaticInjector.Instance.get(NgbModal);
    const modalRef = modalService.open(MotoristaManterComponent, { centered: true, backdrop: 'static' });
    return modalRef;
  }

  // tslint:disable-next-line: member-ordering
  public static async exibeModalDeCriar(): Promise<void> {
    const modalRef = this.exibeModal();
    modalRef.componentInstance.titulo = 'Inclusão de Motorista';
    await modalRef.result;
  }

    // tslint:disable-next-line: member-ordering
    public static async exibeModalDeAlterar(entidade: Motorista): Promise<void> {
      const modalRef = this.exibeModal();
      modalRef.componentInstance.titulo = 'Edição de Motorista';
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
      await this.service.criarMotorista({
        nome: this.nomeFormControl.value,
        ajudante1: this.ajudante1FormControl.value,
        ajudante2: this.ajudanteAdcianalFormControl.value,
        telefone1: this.telefone1FormControl.value,
        telefone2: this.telefoneAdcinalFormControl.value,
        placa: this.placaFormControl.value
      });
      this.dialog.showAlert('Cadastro realizado com sucesso', 'O Motorista foi registrado no sistema.')
      .then(() => this.activeModal.close(this.entidade));
    } catch (error) {
      this.dialog.showErr('Cadastro não realizado', (error as HttpErrorResult).messages.join('\n'));
      throw error;
    }
  }

  private async atualizar(): Promise<void> {
    try {
      await this.service.atualizarMotorista({
        cod_Motorista: this.entidade.cod_Motorista,
        nome: this.nomeFormControl.value,
        ajudante1: this.ajudante1FormControl.value,
        ajudante2: this.ajudanteAdcianalFormControl.value,
        telefone1: this.telefone1FormControl.value,
        telefone2: this.telefoneAdcinalFormControl.value,
        placa: this.placaFormControl.value
      });
      this.dialog.showAlert('Alteração realizada com sucesso', 'O Motorista foi alterado no sistema.')
      .then(() => this.activeModal.close(this.entidade));
    } catch (error) {
      this.dialog.showErr('Alteração não realizada', (error as HttpErrorResult).messages.join('\n'));
      throw error;
    }
  }


}
