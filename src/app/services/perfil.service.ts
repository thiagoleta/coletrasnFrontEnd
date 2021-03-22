import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Perfil } from '../models/perfil.model';
import { HttpErrorResult } from '../views/http/http-error-result';
import { TransferenciaArquivos } from './transferencia-arquivos.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  // tslint:disable-next-line: no-inferrable-types
  protected endPoint: string = 'Perfil';

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
  ): Promise<{ data: Array<Perfil>, total: number }> {
    try {
      const url = this.url(`?pagina=${pagina}&quantidade=${quantidade}&coluna=${coluna}&direcao=${direcao}`);
      return await this.httpClient.get<{ data: Array<Perfil>, total: number }>(url)
        .pipe(map(x => {
          return {
            total: x.total,
            data: x.data.map(p => Perfil.fromJson(p))
          };
        })).toPromise();
    } catch (error) {
      console.error(error);
      throw HttpErrorResult.fromError(error);
    }
  }

  async criarPerfil(model: {
    nome_Perfil: string    
  }): Promise<void> {
    try {
      await this.httpClient.post<void>(this.url(), {
        nome_Perfil: model.nome_Perfil         

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
  
async atualizarPerfil(model: {
  cod_Perfil: number;
  nome_Perfil: string  
}): Promise<void> {
  try {
      await this.httpClient.put<void>(this.url(), {
        cod_Perfil: model.cod_Perfil,          
          nome_Perfil: model.nome_Perfil
                
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

async remover(cod_Perfil: number): Promise<void> {
  try {
      await this.httpClient.delete<void>(this.url(`${cod_Perfil}`)).toPromise();
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

async obter(): Promise<Array<Perfil>> {
  try {
    return await this.httpClient
      .get<Array<Perfil>>(this.url(`perfil`))
      .toPromise();
  } catch (error) {
    throw HttpErrorResult.fromError(error);
  }
}


}
