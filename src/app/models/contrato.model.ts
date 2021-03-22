import { Cliente } from "./cliente.model";


export class Contrato {
    cod_Contrato: number;
    cliente: Cliente;
    coletaContratada: number;
    valorLimite: number;
    valorUnidade: number;
    dataInicio: Date;
    motivoCancelamento: string;   
    dataCancelamento?: Date;   
    flagTermino: string;
    dataTermino: Date;

	


    static fromJson(r: any): Contrato {
        const contrato = new Contrato();
        contrato.cod_Contrato = r.cod_Contrato;
        contrato.cliente = r.cliente;
        contrato.coletaContratada = r.coletaContratada;
        contrato.valorLimite = r.valorLimite;
        contrato.valorUnidade = r.valorUnidade;
        contrato.dataInicio = r.dataInicio
        contrato.motivoCancelamento = r.motivoCancelamento;
        contrato.dataCancelamento = r.dataCancelamento;
        contrato.flagTermino = r.flagTermino;
        contrato.dataTermino = r.dataTermino;       
        
        return contrato;
    }

}

