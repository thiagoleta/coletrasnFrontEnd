import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Cliente } from '../models/cliente.model';
import { HttpErrorResult } from '../views/http/http-error-result';
import { TransferenciaArquivos } from './transferencia-arquivos.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  protected endPoint: string = 'Cliente';

  constructor(private httpClient: HttpClient,
    private exportarService: TransferenciaArquivos) { }

    private urlBase: string = environment.local_url + '/api/Cliente';

    private url(paramentros: string = ''): string {
      return `${environment.local_url}/api/${this.endPoint}/${paramentros}`;

  }


      
    public async obterPaginado(
      pagina: number, quantidade: number,
      coluna: 'nomeCompleto_RazaoSocial' | 'cpF_CNPJ' | 'fantasia' | 'insc_Estadual' | 'bairro' | 'endereco' | 'cEP' | 'telefones' | 'email' | 'flag_Ativo' | 'observacao' | 'referencia', direcao: 'asc' | 'desc',
      nomeCompleto_RazaoSocial?: string, cpF_CNPJ?: string
    ): Promise<{ data: Cliente[], total: number }> {
      try {
        // tslint:disable-next-line: max-line-length
        const url: string = `${this.urlBase}/?pagina=${pagina}&quantidade=${quantidade}&coluna=${coluna}&direcao=${direcao}&nomeCompleto_RazaoSocial=${nomeCompleto_RazaoSocial}&cpF_CNPJ=${cpF_CNPJ}`;
        return await this.httpClient.get<{ data: Cliente[], total: number }>(url)
          .pipe(map(x => {
            return {
              total: x.total,
              data: x.data.map(p => Cliente.fromJson(p))
            };
          }))
          .toPromise();
      } catch (error) {
        throw HttpErrorResult.fromError(error);
      }
    }

    async criarCliente(model: {
      cpF_CNPJ: string,
      nomeCompleto_RazaoSocial: string,
      fantasia: string,
      insc_Estadual: string,
      logradouro: string,
      endereco: string,
      bairro: string,
      complemento: string,
      cidade: string,
      cep: string,
      uF: string;
      telefones: string,
      funcao: string,
      email: string;
      flag_Ativo: string,
      observacao: string,
      referencia: string
    }): Promise<void> {
      try {
        await this.httpClient.post<void>(this.url(), {
          cpF_CNPJ: model.cpF_CNPJ,
          nomeCompleto_RazaoSocial: model.nomeCompleto_RazaoSocial,
          fantasia: model.fantasia,
          insc_Estadual: model.insc_Estadual,
          logradouro: model.logradouro,
          endereco: model.endereco,
          bairro: model.bairro,
          complemento: model.complemento,
          cidade: model.cidade,
          cEP: model.cep,
          uF: model.uF,
          telefones: model.telefones,
          funcao: model.funcao,
          email: model.email,
          flag_Ativo: model.flag_Ativo,
          observacao: model.observacao,
          referencia: model.referencia
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
  
    async atualizarCliente(model: {
      cod_Cliente: number,
      cpF_CNPJ: string,
      nomeCompleto_RazaoSocial: string,
      fantasia: string,
      insc_Estadual: string,
      logradouro: string,
      endereco: string,
      bairro: string,
      complemento: string,
      cidade: string,
      cep: string,
      uF: string;
      telefones: string,
      funcao: string,
      email: string;
      flag_Ativo: string,
      observacao: string,
      referencia: string
    }): Promise<void> {
      try {
        await this.httpClient.put<void>(this.url(), {
          cod_Cliente: model.cod_Cliente,
          cPF_CNPJ: model.cpF_CNPJ,
          nomeCompleto_RazaoSocial: model.nomeCompleto_RazaoSocial,
          fantasia: model.fantasia,
          insc_Estadual: model.insc_Estadual,
          logradouro: model.logradouro,
          endereco: model.endereco,
          bairro: model.bairro,
          complemento: model.complemento,
          cidade: model.cidade,
          cep: model.cep,
          uF: model.uF,
          telefones: model.telefones,
          funcao: model.funcao,
          email: model.email,
          flag_Ativo: model.flag_Ativo,
          observacao: model.observacao,
          referencia: model.referencia
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
  

    async remover(cod_Cliente: number): Promise<void> {
      try {
        await this.httpClient.delete<void>(this.url(`${cod_Cliente}`)).toPromise();
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

  async obter(): Promise<Array<Cliente>> {
    try {
      return await this.httpClient
        .get<Array<Cliente>>(this.url(`clientesativos`))
        .toPromise();
    } catch (error) {
      throw HttpErrorResult.fromError(error);
    }
  }

  }



  

