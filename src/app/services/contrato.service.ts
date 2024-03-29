import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Contrato } from '../models/contrato.model';
import { HttpErrorResult } from '../views/http/http-error-result';
import { TransferenciaArquivos } from './transferencia-arquivos.service';

@Injectable({
  providedIn: 'root'
})
export class ContratoService {

  protected endPoint: string = 'Contrato';

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
  ): Promise<{ data: Array<Contrato>, total: number }> {
    try {
        const url = this.url(`?pagina=${pagina}&quantidade=${quantidade}&coluna=${coluna}&direcao=${direcao}`);
  
        return await this.httpClient.get<{ data: Array<Contrato>, total: number }>(url)
            .pipe(map(x => {
                return {
                    total: x.total,
                    data: x.data.map(p => Contrato.fromJson(p))
                };
            })).toPromise();
    } catch (error) {
        console.error(error);
        throw HttpErrorResult.fromError(error);
    }
  }

 
  
  async criarContrato(model: {      
    cod_Cliente: number
    coletaContratada: number,
    valorLimite: number,
    valorUnidade: number,
    dataInicio: Date,
    motivoCancelamento: string,
    dataCancelamento?: Date,
    flagTermino: boolean,
    dataTermino: Date,  
    
  }): Promise<void> {
    try {
      await this.httpClient.post<void>(this.url(), {        
        cod_Cliente: model.cod_Cliente,
        coletaContratada: model.coletaContratada,
        valorLimite: model.valorLimite,
        valorUnidade: model.valorUnidade,
        dataInicio: model.dataInicio,
        motivoCancelamento: model.motivoCancelamento,
        dataCancelamento: model.dataCancelamento,
        flagTermino: model.flagTermino,      
        dataTermino: model.dataTermino        
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
  
  
  async atualizarContrato(model: {
    cod_Contrato: number;
    cod_Cliente: number
    coletaContratada: number,
    valorLimite: number,
    valorUnidade: number,
    dataInicio: Date,
    motivoCancelamento: string,
    dataCancelamento?: Date,
    flagTermino: string,
    dataTermino: Date, 
  }): Promise<void> {
    try {
        await this.httpClient.put<void>(this.url(), {
          cod_Contrato: model.cod_Contrato,
          cod_Cliente: model.cod_Cliente,
          coletaContratada: model.coletaContratada,
          valorLimite: model.valorLimite,
          valorUnidade: model.valorUnidade,
          dataInicio: model.dataInicio,
          motivoCancelamento: model.motivoCancelamento,
          dataCancelamento: model.dataCancelamento,
          flagTermino: model.flagTermino,      
          dataTermino: model.dataTermino  
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
  
  async remover(cod_Contrato: number): Promise<void> {
    try {
        await this.httpClient.delete<void>(this.url(`${cod_Contrato}`)).toPromise();
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
  