import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Os } from '../models/os.model';
import { HttpErrorResult } from '../views/http/http-error-result';
import { TransferenciaArquivos } from './transferencia-arquivos.service';

@Injectable({
  providedIn: 'root'
})
export class OsService {

  protected endPoint: string = 'OS';

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
): Promise<{ data: Array<Os>, total: number }> {
  try {
      const url = this.url(`?pagina=${pagina}&quantidade=${quantidade}&coluna=${coluna}&direcao=${direcao}`);

      return await this.httpClient.get<{ data: Array<Os>, total: number }>(url)
          .pipe(map(x => {
              return {
                  total: x.total,
                  data: x.data.map(p => Os.fromJson(p))
              };
          })).toPromise();
  } catch (error) {
      console.error(error);
      throw HttpErrorResult.fromError(error);
  }
}



async remover(cod_OS: number): Promise<void> {
  try {
      await this.httpClient.delete<void>(this.url(`${cod_OS}`)).toPromise();
  } catch (error) {
      const httpError: HttpErrorResponse = error;
      if (Array.isArray(httpError.error)) {
          throw new HttpErrorResult(httpError.error);
      } else {
          throw new HttpErrorResult(['Erro desconhecido']);
      }
  }
}

async atualizarOs(model: {
  cod_OS: number;
  cod_Cliente: number;
  cod_MesReferencia: number,
  cod_Material: number,
  cod_Motorista: number,  
  quantidade_Coletada: number,
  data_Coleta: Date,
  flag_Coleta: boolean,
  flag_Envio_Email: boolean,
  flag_Cancelado: boolean,
  motivo_Cancelamento: string,
  data_Cancelamento: Date,
  hora_Entrada: string,
  hora_Saida: string,
  
}): Promise<void> {
  try {
      await this.httpClient.put<void>(this.url(), {
        cod_OS: model.cod_OS,
          cod_Cliente: model.cod_Cliente,
          cod_MesReferencia: model.cod_MesReferencia,
          cod_Material: model.cod_Material,
          cod_Motorista: model.cod_Motorista,          
          quantidade_Coletada: model.quantidade_Coletada,
          data_Coleta: model.data_Coleta,
          flag_Coleta: model.flag_Coleta,
          flag_Envio_Email: model.flag_Envio_Email,
          flag_Cancelado: model.flag_Cancelado,
          motivo_Cancelamento: model.motivo_Cancelamento,
          data_Cancelamento: model.data_Cancelamento,
          hora_Entrada: model.hora_Entrada,
          hora_Saida: model.hora_Saida
          
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
