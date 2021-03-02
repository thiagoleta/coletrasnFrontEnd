import { PipeTransform } from '@angular/core';

export class Coluna {

    constructor(titulo: string, data: any, ordernar: boolean, largura?: string, format?: PipeTransform, pattern?, dataTitle?: string, style?: object, dataLimited?: boolean) {
      this.titulo = titulo;
      this.data = data;
      this.ordernar = ordernar;
      this.largura = largura;
      if (!this.largura || this.largura.length === 0) this.largura = 'auto';
      this.format = format;
      this.pattern = pattern;
      this.dataTitle = dataTitle;
      this.style = style;
      this.dataLimited = dataLimited;
    }

    getData(registro: any) {
      const info  = registro[this.data];
      if (this.format) return this.format.transform(info, this.pattern);
      return info;
    }
  
    titulo: string;
    data: any;
    ordernar: boolean;
    largura: string;    
    format: PipeTransform;
    pattern: Array<any>;
    dataTitle: string;
    style: object;
    dataLimited: boolean;
  }
  