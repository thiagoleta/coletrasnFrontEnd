import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TransferenciaArquivos {

  downloadOptions = { observe: 'response' as 'body', responseType: 'blob' as 'json' };

  constructor() { }

  obterNomeArquivo(respostaRequisicao: { headers: any}): string {
    return respostaRequisicao.headers.get('Content-Disposition').split(';')[1].split('filename')[1].split('=')[1].trim();
  }

  downloadFile(blob: Blob, filename: string) {
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);

    a.href = url;
    a.download = filename;
    a.click();

    document.body.removeChild(a);
  }

  download(file: Blob, filename: string) {
    if (navigator.appVersion.toString().indexOf('.NET') > 0) {
      window.navigator.msSaveBlob(file, filename);
    } else {
      this.downloadFile(file, filename);
    }
  }
}
