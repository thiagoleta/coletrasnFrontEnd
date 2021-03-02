import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Rota } from '../models/rota.model';
import { HttpErrorResult } from '../views/http/http-error-result';
import { TransferenciaArquivos } from './transferencia-arquivos.service';

@Injectable({
  providedIn: 'root'
})
export class RotaService {

  // tslint:disable-next-line: no-inferrable-types
  protected endPoint: string = 'Rota';

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
  ): Promise<{ data: Array<Rota>, total: number }> {
    try {
      const url = this.url(`?pagina=${pagina}&quantidade=${quantidade}&coluna=${coluna}&direcao=${direcao}`);
      return await this.httpClient.get<{ data: Array<Rota>, total: number }>(url)
        .pipe(map(x => {
          return {
            total: x.total,
            data: x.data.map(p => Rota.fromJson(p))
          };
        })).toPromise();
    } catch (error) {
      console.error(error);
      throw HttpErrorResult.fromError(error);
    }
  }


  async criarRota(model: {
    nome: string,
    composicao_Rota: string,
    flag_Ativo: boolean,
    observacao: string
  }): Promise<void> {
    try {
      await this.httpClient.post<void>(this.url(), {
        nome: model.nome,
        composicao_Rota: model.composicao_Rota,
        flag_Ativo: model.flag_Ativo,
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

  async atualizarRota(model: {
    cod_Rota,
    nome: string,
    composicao_Rota: string,
    flag_Ativo: boolean,
    observacao: string
}): Promise<void> {
    try {
        await this.httpClient.put<void>(this.url(), {
          cod_Rota: model.cod_Rota,
            nome: model.nome,
            composicao_Rota: model.composicao_Rota,
            flag_Ativo: model.flag_Ativo,
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

async remover(cod_Rota: number): Promise<void> {
  try {
      await this.httpClient.delete<void>(this.url(`${cod_Rota}`)).toPromise();
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

async obter(): Promise<Array<Rota>> {
  try {
    return await this.httpClient
      .get<Array<Rota>>(this.url(`rotasativas`))
      .toPromise();
  } catch (error) {
    throw HttpErrorResult.fromError(error);
  }
}

}


