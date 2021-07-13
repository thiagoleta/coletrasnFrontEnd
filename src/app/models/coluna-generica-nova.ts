import { PipeTransform } from '@angular/core';

export class ColunaNova {

  constructor(titulo: string, data: any, ordernar: boolean, format?: PipeTransform, pattern?: Array<any>, largura?: string, dataTitle?: string) {
    this.titulo = titulo;
    this.data = data;
    this.ordernar = ordernar;
    this.format = format;
    this.pattern = pattern;
    this.largura = largura;
    if (!this.largura || this.largura.length === 0) this.largura = 'auto';
    this.dataTitle = dataTitle;
  }

  titulo: string;
  data: any;
  ordernar: boolean;
  format: PipeTransform;
  pattern: Array<any>;
  largura: string;
  dataTitle: any;

  getData(registro: any) {
    const info = registro[this.data];
    if (this.format && info) return this.format.transform(info, this.pattern);
    return info;
  }

  getDataTitle(registro: any) {
    const info  = registro[this.dataTitle];
    if (this.format && info) return this.format.transform(info, this.pattern);
    return info;
  }
}
