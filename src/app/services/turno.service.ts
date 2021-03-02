import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Turno } from '../models/turno.model';
import { HttpErrorResult } from '../views/http/http-error-result';
import { TransferenciaArquivos } from './transferencia-arquivos.service';

@Injectable({
  providedIn: 'root'
})
export class TurnoService {

  // tslint:disable-next-line: no-inferrable-types
protected endPoint: string = 'Turno';

protected httpHeaders: HttpHeaders;
cookieService: any;

constructor(private httpClient: HttpClient,
  private exportarService: TransferenciaArquivos
) { }

private url(paramentros: string = ''): string {
  return `${environment.local_url}/api/${this.endPoint}/${paramentros}`;  
}

async obter(): Promise<Array<Turno>> {
  try {
    return await this.httpClient
      .get<Array<Turno>>(this.url(`turnos`))
      .toPromise();
  } catch (error) {
    throw HttpErrorResult.fromError(error);
  }
}


}
