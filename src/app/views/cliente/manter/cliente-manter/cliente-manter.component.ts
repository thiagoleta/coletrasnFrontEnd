import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbModalRef, NgbTabset } from '@ng-bootstrap/ng-bootstrap';
import { Cliente } from 'src/app/models/cliente.model';
import { ClienteService } from 'src/app/services/cliente.service';
import { DialogService } from 'src/app/services/dialog.service';
import { StaticInjector } from 'src/app/services/static-injector';
import { HttpErrorResult } from 'src/app/views/http/http-error-result';

@Component({
  selector: 'app-cliente-manter',
  templateUrl: './cliente-manter.component.html',
  styleUrls: ['./cliente-manter.component.css']
})
export class ClienteManterComponent implements OnInit {

  titulo: string = 'Inclusão de Profissional';
  entidade: Cliente;

  cpfCnpjFormControl: FormControl = new FormControl('', [Validators.required]);
  nomeCompletoFormControl: FormControl = new FormControl('', [Validators.required]);
  fantasiaFormControl: FormControl = new FormControl('', [Validators.required]);
  InscEstadualFormControl: FormControl = new FormControl('', [Validators.required]);
  logradouroFormControl: FormControl = new FormControl(null);
  enderecoFormControl: FormControl = new FormControl(null);
  bairroFormControl: FormControl = new FormControl(null);
  complementoFormControl: FormControl = new FormControl(null);
  telefoneFormControl: FormControl = new FormControl(null);
  cidadeFormControl: FormControl = new FormControl(null);
  cepFormControl: FormControl = new FormControl(null);
  ufFormControl: FormControl = new FormControl(null);
  funcaoFormControl: FormControl = new FormControl('');
  emailFormControl: FormControl = new FormControl('', [Validators.maxLength(60)]);
  flagFormControl: FormControl = new FormControl(null);
  observacaoFormControl: FormControl = new FormControl('', [Validators.maxLength(4000)]);
  referenciaFormControl: FormControl = new FormControl('', [Validators.maxLength(4000)]);

  formulario: FormGroup = new FormGroup({
    cPF_CNPJ: this.cpfCnpjFormControl,
    nomeCompleto_RazaoSocial: this.nomeCompletoFormControl,
    fantasia: this.fantasiaFormControl,
    insc_Estadual: this.InscEstadualFormControl,
    logradouro: this.logradouroFormControl,
    endereco: this.enderecoFormControl,
    bairro: this.bairroFormControl,
    complemento: this.complementoFormControl,
    cidade: this.cidadeFormControl,
    telefones: this.telefoneFormControl,
    cEP: this.cepFormControl,
    uF: this.ufFormControl,
    funcao: this.funcaoFormControl,
    email: this.emailFormControl,
    flag_Ativo: this.flagFormControl,
    observacao: this.observacaoFormControl,
    referencia: this.referenciaFormControl
  });

  mascaraCep = [/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/, '-', /[0-9]/, /[0-9]/, /[0-9]/];

  constructor(
    public activeModal: NgbActiveModal, private service: ClienteService,
    private dialog: DialogService) { }

  async ngOnInit(): Promise<void> {
    try {
      // const cep = this.entidade.cEP ? this.entidade.cEP : null;
      if (this.entidade) {
        this.cpfCnpjFormControl.setValue(this.entidade.cpF_CNPJ);
        this.nomeCompletoFormControl.setValue(this.entidade.nomeCompleto_RazaoSocial);
        this.fantasiaFormControl.setValue(this.entidade.fantasia);
        this.InscEstadualFormControl.setValue(this.entidade.insc_Estadual);
        this.logradouroFormControl.setValue(this.entidade.logradouro);
        this.enderecoFormControl.setValue(this.entidade.endereco);
        this.bairroFormControl.setValue(this.entidade.bairro);
        this.complementoFormControl.setValue(this.entidade.complemento);
        this.cidadeFormControl.setValue(this.entidade.cidade);
        this.telefoneFormControl.setValue(this.entidade.telefones);
        this.cepFormControl.setValue(this.entidade.cep);
        this.ufFormControl.setValue(this.entidade.uF);
        this.funcaoFormControl.setValue(this.entidade.funcao);
        this.emailFormControl.setValue(this.entidade.email);
        this.flagFormControl.setValue(this.entidade.flag_Ativo);
        this.observacaoFormControl.setValue(this.entidade.observacao);
        this.referenciaFormControl.setValue(this.entidade.referencia);
      }

    } catch (error) {
      console.error(error);
      // await this.dialog.showErr('Não foi possível carregar as informações', (error as HttpErrorResult).messages.join('\n'));
      this.activeModal.dismiss();
    }
  }

  
  // tslint:disable-next-line: member-ordering
  private static exibeModal(): NgbModalRef {
    const modalService: NgbModal = StaticInjector.Instance.get(NgbModal);
    const modalRef = modalService.open(ClienteManterComponent, { centered: true, size: 'lg', backdrop: 'static' });
    return modalRef;
  }

    // tslint:disable-next-line: member-ordering
    public static async exibeModalDeCriar(): Promise<void> {
      const modalRef = this.exibeModal();
      modalRef.componentInstance.titulo = 'Inclusão de Cliente';
      await modalRef.result;
    }
  
      // tslint:disable-next-line: member-ordering
  public static async exibeModalDeAlterar(entidade: Cliente): Promise<void> {
    const modalRef = this.exibeModal();
    modalRef.componentInstance.titulo = 'Edição de Cliente';
    modalRef.componentInstance.entidade = entidade;
    await modalRef.result;
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
      await this.service.criarCliente({
        cpF_CNPJ: this.cpfCnpjFormControl.value,
        nomeCompleto_RazaoSocial: this.nomeCompletoFormControl.value,
        fantasia: this.fantasiaFormControl.value,
        insc_Estadual: this.InscEstadualFormControl.value,
        logradouro: this.logradouroFormControl.value,
        endereco: this.enderecoFormControl.value,
        bairro: this.bairroFormControl.value,
        complemento: this.complementoFormControl.value,
        cidade: this.cidadeFormControl.value,
        cep: this.cepFormControl.value,
        uF: this.ufFormControl.value,
        telefones: this.telefoneFormControl.value,
        funcao: this.funcaoFormControl.value,
        email: this.emailFormControl.value,
        flag_Ativo: this.flagFormControl.value,
        observacao: this.observacaoFormControl.value,
        referencia: this.referenciaFormControl.value
      });
      this.dialog.showAlert('Cadastro realizado com sucesso', 'O Cliente foi registrado no sistema.')
      .then(() => this.activeModal.close(this.entidade));
    } catch (error) {
      this.dialog.showErr('Cadastro não realizado', (error as HttpErrorResult).messages.join('\n'));
      throw error;
    }
  }

  private async atualizar(): Promise<void> {
    try {
      await this.service.atualizarCliente({
        cod_Cliente: this.entidade.cod_Cliente,
        cpF_CNPJ: this.cpfCnpjFormControl.value,
        nomeCompleto_RazaoSocial: this.nomeCompletoFormControl.value,
        fantasia: this.fantasiaFormControl.value,
        insc_Estadual: this.InscEstadualFormControl.value,
        logradouro: this.logradouroFormControl.value,
        endereco: this.enderecoFormControl.value,
        bairro: this.bairroFormControl.value,
        complemento: this.complementoFormControl.value,
        cidade: this.cidadeFormControl.value,
        cep: this.cepFormControl.value,
        uF: this.ufFormControl.value,
        telefones: this.telefoneFormControl.value,
        funcao: this.funcaoFormControl.value,
        email: this.emailFormControl.value,
        flag_Ativo: this.flagFormControl.value,
        observacao: this.observacaoFormControl.value,
        referencia: this.referenciaFormControl.value
      });
      this.dialog.showAlert('Alteração realizada com sucesso', 'O Cliente foi alterado no sistema.')
      .then(() => this.activeModal.close(this.entidade));
    } catch (error) {
      this.dialog.showErr('Alteração não realizada', (error as HttpErrorResult).messages.join('\n'));
      throw error;
    }
  }
 
  desabilitaTooltip(formControl: FormControl) {
    return formControl.untouched || formControl.valid;
  }

}

