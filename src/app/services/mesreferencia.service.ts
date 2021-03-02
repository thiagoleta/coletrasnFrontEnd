import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { HttpErrorResult } from '../views/http/http-error-result';
import { TransferenciaArquivos } from './transferencia-arquivos.service';
import { MesReferencia } from '../models/mesreferencia.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MesreferenciaService {

  protected endPoint: string = 'MesReferencia';

  protected httpHeaders: HttpHeaders;
  cookieService: any;


  constructor(private httpClient: HttpClient,
    private exportarService: TransferenciaArquivos
) { }

private url(paramentros: string = ''): string {
  return `${environment.local_url}/api/${this.endPoint}/${paramentros}`;

}

async obterPaginado(
  pagina: number,
  quantidade: number,
  coluna: string,
  direcao: 'asc' | 'desc'
): Promise<{ data: Array<MesReferencia>, total: number }> {
  try {
      const url = this.url(`?pagina=${pagina}&quantidade=${quantidade}&coluna=${coluna}&direcao=${direcao}`);

      return await this.httpClient.get<{ data: Array<MesReferencia>, total: number }>(url)
          .pipe(map(x => {
              return {
                  total: x.total,
                  data: x.data.map(p => MesReferencia.fromJson(p))
              };
          })).toPromise();
  } catch (error) {
      console.error(error);
      throw HttpErrorResult.fromError(error);
  }
}


async criarMesRef(model: {  
  mesAno: string,
  dataInicio: Date,
  dataTermino: Date,
  ativo: string
}): Promise<void> {
  try {
      await this.httpClient.post<void>(this.url(), {        
        mesAno: model.mesAno,
        dataInicio: model.dataInicio,
        dataTermino: model.dataTermino,
        ativo: model.ativo
      }).toPromise();
  } catch (error) {
      const httpError: HttpErrorResponse = error;
      if (Array.isArray(httpError.error)) {
          throw new HttpErrorResult(httpError.error);
      } else {
          throw new HttpErrorResult(['Erro desconhecido']);
      }
  }
}

async atualizarMesRef(model: {
  cod_MesReferencia: number,
  mesAno: string,
  dataInicio: Date,
  dataTermino: Date,
  ativo: boolean  
}): Promise<void> {
  try {
      await this.httpClient.put<void>(this.url(), {
        cod_MesReferencia: model.cod_MesReferencia,
        mesAno: model.mesAno,
        dataInicio: model.dataInicio,
        dataTermino: model.dataTermino,
        ativo: model.ativo          
      }).toPromise();
  } catch (error) {
      const httpError: HttpErrorResponse = error;
      if (Array.isArray(httpError.error)) {
          throw new HttpErrorResult(httpError.error);
      } else {
          throw new HttpErrorResult(['Erro desconhecido']);
      }
  }
}


async remover(cod_MesReferencia: number): Promise<void> {
  try {
      await this.httpClient.delete<void>(this.url(`${cod_MesReferencia}`)).toPromise();
  } catch (error) {
      const httpError: HttpErrorResponse = error;
      if (Array.isArray(httpError.error)) {
          throw new HttpErrorResult(httpError.error);
      } else {
          throw new HttpErrorResult(['Erro desconhecido']);
      }
  }
}

async exportar(coluna: string, direcao: string): Promise<void> {
  try {
      // tslint:disable-next-line: max-line-length
      const response: any = await this.httpClient.get(this.url(`exportar?descricao=${coluna}&direcao=${direcao}`), this.exportarService.downloadOptions).toPromise();
      const file = response.body;
      const filename = this.exportarService.obterNomeArquivo(response);
      this.exportarService.download(file, filename);

  } catch (error) {
      const httpError: HttpErrorResponse = error;
      if (Array.isArray(httpError.error)) {
          throw new HttpErrorResult(httpError.error);
      } else {
          throw new HttpErrorResult(['Erro desconhecido']);
      }
  }
}

createHttpHeaders() {

  //verificar se há um TOKEN gravado em COOKIE  
  var token = this.cookieService.get('acess_token');
  console.log(token);
  if (token != null && token.length > 0) {
    //montando o HEADER com AUTHORIZATION   
    this.httpHeaders = new HttpHeaders()
      .set('Authorization', 'Bearer ' + token);
  }
  else {
     window.location.href = "/autenticar-usuario";
  }
}

}
