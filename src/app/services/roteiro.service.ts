import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Roteiro } from '../models/roteiro.model';
import { HttpErrorResult } from '../views/http/http-error-result';
import { TransferenciaArquivos } from './transferencia-arquivos.service';

@Injectable({
  providedIn: 'root'
})
export class RoteiroService {
  
// tslint:disable-next-line: no-inferrable-types
protected endPoint: string = 'Roteiro';

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
): Promise<{ data: Array<Roteiro>, total: number }> {
  try {
      const url = this.url(`?pagina=${pagina}&quantidade=${quantidade}&coluna=${coluna}&direcao=${direcao}`);

      return await this.httpClient.get<{ data: Array<Roteiro>, total: number }>(url)
          .pipe(map(x => {
              return {
                  total: x.total,
                  data: x.data.map(p => Roteiro.fromJson(p))
              };
          })).toPromise();
  } catch (error) {
      console.error(error);
      throw HttpErrorResult.fromError(error);
  }
}

async criarRoteiro(model: {  
  cod_Cliente: number;
  cod_Turno: number
  cod_Rota: number,
  cod_Motorista: number,
  cod_Material: number,
  segunda: boolean,
  terca: boolean,
  quarta: boolean,
  quinta: boolean,
  sexta: boolean,
  sabado: boolean,
  domingo: boolean,
  observacao: string
}): Promise<void> {
  try {
    await this.httpClient.post<void>(this.url(), {
      cod_Cliente: model.cod_Cliente,
      cod_Turno: model.cod_Turno,
      cod_Rota: model.cod_Rota,
      cod_Material: model.cod_Material,
      segunda: model.segunda,
      terca: model.terca,
      quarta: model.quarta,      
      quinta: model.quinta,
      sexta: model.sexta,
      sabado: model.sabado,
      domingo: model.domingo,
      observacao: model.observacao
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


async atualizarRoteiro(model: {
  cod_Roteiro: number;
  cod_Cliente: number;
  cod_Turno: number
  cod_Rota: number,
  cod_Motorista: number,
  cod_Material: number,
  segunda: boolean,
  terca: boolean,
  quarta: boolean,
  quinta: boolean,
  sexta: boolean,
  sabado: boolean,
  domingo: boolean,
  observacao: string,
}): Promise<void> {
  try {
      await this.httpClient.put<void>(this.url(), {
          cod_Roteiro: model.cod_Roteiro,
          cod_Cliente: model.cod_Cliente,
          cod_Turno: model.cod_Turno,
          cod_Rota: model.cod_Rota,
          cod_Motorista: model.cod_Motorista,
          cod_Material: model.cod_Material,
          segunda: model.segunda,
          terca: model.terca,
          quarta: model.quarta,
          quinta: model.quinta,
          sexta: model.sexta,
          sabado: model.sabado,
          domingo: model.domingo,
          observacao: model.observacao
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

async remover(cod_Roteiro: number): Promise<void> {
  try {
      await this.httpClient.delete<void>(this.url(`${cod_Roteiro}`)).toPromise();
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

}
