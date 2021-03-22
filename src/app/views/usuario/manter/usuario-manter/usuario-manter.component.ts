import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Usuario } from 'src/app/models/usuario.model';
import { DialogService } from 'src/app/services/dialog.service';
import { PerfilService } from 'src/app/services/perfil.service';
import { StaticInjector } from 'src/app/services/static-injector';
import { UsuarioService } from 'src/app/services/usuario.service';
import { HttpErrorResult } from 'src/app/views/http/http-error-result';

@Component({
  selector: 'app-usuario-manter',
  templateUrl: './usuario-manter.component.html',
  styleUrls: ['./usuario-manter.component.css']
})
export class UsuarioManterComponent implements OnInit {

  @Input() titulo;
  @Input() entidade: Usuario;

  nomeFormControl = new FormControl(null, [Validators.required]);
  emailFormControl = new FormControl(null, [Validators.required]);  
  perfilFormControl =  new FormControl(null, [Validators.required]);
  senhaFormControl = new FormControl(null, [Validators.required]);

  formulario = new FormGroup({
    nome: this.nomeFormControl,
    email: this.emailFormControl,
    perfil: this.perfilFormControl,
    senha: this.senhaFormControl,
    
  });

perfils: Array<any>;

constructor(
  public activeModal: NgbActiveModal,
  private service: UsuarioService,
  private dialog: DialogService,
  private perfilService: PerfilService,
  ) { }

  ngOnInit(): void {
     this.obterPerfils();     
    if (this.entidade) {
      this.nomeFormControl.setValue(this.entidade.nome);
      this.emailFormControl.setValue(this.entidade.email);
      this.perfilFormControl.setValue(this.entidade.perfil.cod_Perfil);
      this.senhaFormControl.setValue(this.entidade.senha);      

    }
  }

  
    // tslint:disable-next-line: member-ordering
    private static exibeModal(): NgbModalRef {
      const modalService: NgbModal = StaticInjector.Instance.get(NgbModal);
      const modalRef = modalService.open(UsuarioManterComponent, { centered: true, backdrop: 'static' });
      return modalRef;
    }

      // tslint:disable-next-line: member-ordering
      public static async exibeModalDeCriar(): Promise<void> {
        const modalRef = this.exibeModal();
        modalRef.componentInstance.titulo = 'Inclusão de Usuário';
        await modalRef.result;
      }
    
    // tslint:disable-next-line: member-ordering
    public static async exibeModalDeAlterar(entidade: Usuario): Promise<void> {
      const modalRef = this.exibeModal();
      modalRef.componentInstance.titulo = 'Edição de Usuário';
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
      await this.service.criarUsuario({
        nome: this.nomeFormControl.value ? this.nomeFormControl.value : null,
        email: this.emailFormControl.value ? this.emailFormControl.value : null,
        cod_Perfil: this.perfilFormControl.value ? this.perfilFormControl.value : null,
        senha: this.senhaFormControl.value ? this.senhaFormControl.value : null,        
      });
      this.dialog.showAlert('Cadastro realizado com sucesso', 'O Usuário foi registrado no sistema.')
      .then(() => this.activeModal.close(this.entidade));
    } catch (error) {
      this.dialog.showErr('Cadastro não realizado', (error as HttpErrorResult).messages.join('\n'));
      throw error;
    }
  }

  private async atualizar(): Promise<void> {
    try {
      await this.service.atualizarUsuario({
        cod_Usuario: this.entidade.cod_Usuario,
        nome: this.nomeFormControl.value,
        email: this.emailFormControl.value ? this.emailFormControl.value : null,
        cod_Perfil: this.perfilFormControl.value ? this.perfilFormControl.value : null,
        senha: this.senhaFormControl.value ? this.senhaFormControl.value : null,        
      });
      this.dialog.showAlert('Alteração realizada com sucesso', 'O Usuário foi alterado no sistema.')
      .then(() => this.activeModal.close(this.entidade));
    } catch (error) {
      this.dialog.showErr('Alteração não realizada', (error as HttpErrorResult).messages.join('\n'));
      throw error;
    }
  }

  async obterPerfils() {
    try {      
      const perfilServico = await this.perfilService.obter();        
      this.perfils = perfilServico.map((perfil: any) =>  ({ cod_Perfil: perfil.cod_Perfil, nome_Perfil: perfil.nome_Perfil.toUpperCase()}));   
    } catch (error) {
      await this.dialog.showErr('Erro ao obter Perfils', (error as HttpErrorResult).messages.join('\n'));
    }
  }

}
