import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-fitros',
  templateUrl: './fitros.component.html',
  styleUrls: ['./fitros.component.css']
})
export class FitrosComponent implements OnInit {


  nomeCompletoFormControl: FormControl;
  cpfCnpjFormControl: FormControl;

  @Output() obterParametros: EventEmitter<{ nomeCompleto_RazaoSocial: string, cpF_CNPJ: string }> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.nomeCompletoFormControl = new FormControl('');
    this.cpfCnpjFormControl = new FormControl('');

  }

  
  obterValoresDoFiltro() {
    this.obterParametros.emit({
      nomeCompleto_RazaoSocial: this.nomeCompletoFormControl.value,
      cpF_CNPJ: this.cpfCnpjFormControl.value.replace(/[^0-9]+/g, '')
    });
  }


}
