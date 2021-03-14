import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Pagamento } from '../models/pagamento.model';
import { HttpErrorResult } from '../views/http/http-error-result';
import { TransferenciaArquivos } from './transferencia-arquivos.service';

@Injectable({
  providedIn: 'root'
})
export class PagamentoService {

  // tslint:disable-next-line: no-inferrable-types
protected endPoint: string = 'Pagamento';

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
): Promise<{ data: Array<Pagamento>, total: number }> {
  try {
      const url = this.url(`?pagina=${pagina}&quantidade=${quantidade}&coluna=${coluna}&direcao=${direcao}`);

      return await this.httpClient.get<{ data: Array<Pagamento>, total: number }>(url)
          .pipe(map(x => {
              return {
                  total: x.total,
                  data: x.data.map(p => Pagamento.fromJson(p))
              };
          })).toPromise();
  } catch (error) {
      console.error(error);
      throw HttpErrorResult.fromError(error);
  }
}

async criarPagamento(model: {  
  cod_Cliente: number;
  cod_MesReferencia: number
  valor: number,
  data: Date   
}): Promise<void> {
  try {
    await this.httpClient.post<void>(this.url(), {
      cod_Cliente: model.cod_Cliente,
      cod_MesReferencia: model.cod_MesReferencia,
      valor: model.valor,
      data: model.data      
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

async atualizarPagamento(model: {
  cod_Pagamento: number;
  cod_Cliente: number;
  cod_MesReferencia: number
  valor: number,
  data: Date,  
  
}): Promise<void> {
  try {
      await this.httpClient.put<void>(this.url(), {
        cod_Pagamento: model.cod_Pagamento,
          cod_Cliente: model.cod_Cliente,
          cod_MesReferencia: model.cod_MesReferencia,
          valor: model.valor,
          data: model.data          
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


async remover(cod_Pagamento: number): Promise<void> {
  try {
      await this.httpClient.delete<void>(this.url(`${cod_Pagamento}`)).toPromise();
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
