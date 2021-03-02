import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { HttpErrorResult } from '../views/http/http-error-result';
import { TransferenciaArquivos } from './transferencia-arquivos.service';
import { Material } from '../models/material.model';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class MaterialService {

    // tslint:disable-next-line: no-inferrable-types
    protected endPoint: string = 'Material';

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
    ): Promise<{ data: Array<Material>, total: number }> {
        try {
            const url = this.url(`?pagina=${pagina}&quantidade=${quantidade}&coluna=${coluna}&direcao=${direcao}`);

            return await this.httpClient.get<{ data: Array<Material>, total: number }>(url)
                .pipe(map(x => {
                    return {
                        total: x.total,
                        data: x.data.map(p => Material.fromJson(p))
                    };
                })).toPromise();
        } catch (error) {
            console.error(error);
            throw HttpErrorResult.fromError(error);
        }
    }

    async criarMaterial(model: {
        descricao: string,
        volume: string,
        observacao: string,
        material_Coletado: string
    }): Promise<void> {
        try {
            await this.httpClient.post<void>(this.url(), {
                descricao: model.descricao,
                volume: model.volume,
                observacao: model.observacao,
                material_Coletado: model.material_Coletado
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

    async atualizarMaterial(model: {
        cod_Material: number,
        descricao: string,
        volume: string,
        observacao: string,
        material_coletado: string
    }): Promise<void> {
        try {
            await this.httpClient.put<void>(this.url(), {
                cod_Material: model.cod_Material,
                descricao: model.descricao,
                volume: model.volume,
                observacao: model.observacao,
                material_coletado: model.material_coletado
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

    async remover(cod_Material: number): Promise<void> {
        try {
            await this.httpClient.delete<void>(this.url(`${cod_Material}`)).toPromise();
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



    async obter(): Promise<Array<Material>> {
        try {
          return await this.httpClient
            .get<Array<Material>>(this.url(`materiais`))
            .toPromise();
        } catch (error) {
          throw HttpErrorResult.fromError(error);
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
