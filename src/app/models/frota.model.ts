import { Motorista } from "./motorista.model";

export class Frota {
    cod_Frota: number;
    motorista: Motorista;
    descricao: string;
    observacao: string;


    static fromJson(f: any): Frota {
        const frota = new Frota();
        frota.cod_Frota = f.cod_Frota;
        frota.motorista = f.motorista;
        frota.descricao = f.descricao;
        frota.observacao = f.observacao;
        return frota;

    }
}

