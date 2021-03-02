import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { HttpErrorResult } from '../views/http/http-error-result';
import { TransferenciaArquivos } from './transferencia-arquivos.service';
import { map } from 'rxjs/operators';
import { Motorista } from '../models/motorista.model';

@Injectable({
    providedIn: 'root'
})

export class MotoristaService {

    // tslint:disable-next-line: no-inferrable-types
    protected endPoint: string = 'Motorista';

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
    ): Promise<{ data: Array<Motorista>, total: number }> {
        try {
            const url = this.url(`?pagina=${pagina}&quantidade=${quantidade}&coluna=${coluna}&direcao=${direcao}`);

            return await this.httpClient.get<{ data: Array<Motorista>, total: number }>(url)
                .pipe(map(x => {
                    return {
                        total: x.total,
                        data: x.data.map(p => Motorista.fromJson(p))
                    };
                })).toPromise();
        } catch (error) {
            console.error(error);
            throw HttpErrorResult.fromError(error);
        }
    }

    async criarMotorista(model: {
        nome: string,
        ajudante1: string,
        ajudante2: string,
        telefone1: string,
        telefone2: string,
        placa: string
    }): Promise<void> {
        try {
            await this.httpClient.post<void>(this.url(), {
                nome: model.nome,
                ajudante1: model.ajudante1,
                ajudante2: model.ajudante2,
                telefone1: model.telefone1,
                telefone2: model.telefone2,
                placa: model.placa
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

    async atualizarMotorista(model: {
        cod_Motorista: number,
        nome: string,
        ajudante1: string,
        ajudante2: string,
        telefone1: string,
        telefone2: string,
        placa: string
    }): Promise<void> {
        try {
            await this.httpClient.put<void>(this.url(), {
                cod_Motorista: model.cod_Motorista,
                nome: model.nome,
                ajudante1: model.ajudante1,
                ajudante2: model.ajudante2,
                telefone1: model.telefone1,
                telefone2: model.telefone2,
                placa: model.placa
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

    async remover(cod_Motorista: number): Promise<void> {
        try {
            await this.httpClient.delete<void>(this.url(`${cod_Motorista}`)).toPromise();
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

      async obter(): Promise<Array<Motorista>> {
        try {
          return await this.httpClient
            .get<Array<Motorista>>(this.url(`motoristas`))
            .toPromise();
        } catch (error) {
          throw HttpErrorResult.fromError(error);
        }
      }


}
