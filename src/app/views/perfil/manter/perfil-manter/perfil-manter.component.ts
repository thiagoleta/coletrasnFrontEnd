import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Perfil } from 'src/app/models/perfil.model';
import { DialogService } from 'src/app/services/dialog.service';
import { PerfilService } from 'src/app/services/perfil.service';
import { StaticInjector } from 'src/app/services/static-injector';
import { HttpErrorResult } from 'src/app/views/http/http-error-result';

@Component({
  selector: 'app-perfil-manter',
  templateUrl: './perfil-manter.component.html',
  styleUrls: ['./perfil-manter.component.css']
})
export class PerfilManterComponent implements OnInit {

  @Input() titulo;
  @Input() entidade: Perfil;

  nomeFormControl = new FormControl(null, [Validators.required]);

  formulario = new FormGroup({
    nome_Perfil: this.nomeFormControl,    
  });

  

  constructor(
    public activeModal: NgbActiveModal,
    private service: PerfilService,
    private dialog: DialogService,
    ) { }

  ngOnInit(): void {
    if (this.entidade) {
      this.nomeFormControl.setValue(this.entidade.nome_Perfil);       

    }
  }


    // tslint:disable-next-line: member-ordering
    private static exibeModal(): NgbModalRef {
      const modalService: NgbModal = StaticInjector.Instance.get(NgbModal);
      const modalRef = modalService.open(PerfilManterComponent, { centered: true, backdrop: 'static' });
      return modalRef;
    }
  

          // tslint:disable-next-line: member-ordering
  public static async exibeModalDeCriar(): Promise<void> {
    const modalRef = this.exibeModal();
    modalRef.componentInstance.titulo = 'Inclusão de Roteiro';
    await modalRef.result;
  }


      // tslint:disable-next-line: member-ordering
      public static async exibeModalDeAlterar(entidade: Perfil): Promise<void> {
        const modalRef = this.exibeModal();
        modalRef.componentInstance.titulo = 'Edição de Perfil';
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
      await this.service.criarPerfil({
        nome_Perfil: this.nomeFormControl.value ? this.nomeFormControl.value : null,        
      });
      this.dialog.showAlert('Cadastro realizado com sucesso', 'O Perfil foi registrado no sistema.')
      .then(() => this.activeModal.close(this.entidade));
    } catch (error) {
      this.dialog.showErr('Cadastro não realizado', (error as HttpErrorResult).messages.join('\n'));
      throw error;
    }
  }


  private async atualizar(): Promise<void> {
    try {
      await this.service.atualizarPerfil({
        cod_Perfil: this.entidade.cod_Perfil,
        nome_Perfil: this.nomeFormControl.value,        
      });
      this.dialog.showAlert('Alteração realizada com sucesso', 'O Perfil foi alterado no sistema.')
      .then(() => this.activeModal.close(this.entidade));
    } catch (error) {
      this.dialog.showErr('Alteração não realizada', (error as HttpErrorResult).messages.join('\n'));
      throw error;
    }
  }    

}
