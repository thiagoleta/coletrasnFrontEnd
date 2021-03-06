import { Cliente } from "./cliente.model";
import { Material } from "./material.model";
import { Motorista } from "./motorista.model";
import { Rota } from "./rota.model";
import { Turno } from "./turno.model";

export class Roteiro {
    cod_Roteiro: number;
    cliente: Cliente;
    turno: Turno;
    rota: Rota;
    motorista: Motorista;
    material: Material;   
    segunda: boolean;
    terca: boolean;
    quarta: boolean;
    quinta: boolean;
    sexta: boolean;
    sabado: boolean;
    domingo: boolean;
    observacao: string;


    static fromJson(r: any): Roteiro {
        const roteiro = new Roteiro();
        roteiro.cod_Roteiro = r.cod_Roteiro;
        roteiro.cliente = r.cliente;
        roteiro.turno = r.turno;
        roteiro.rota = r.rota;
        roteiro.material = r.material;
        roteiro.motorista = r.motorista;
        roteiro.segunda = r.segunda;
        roteiro.terca = r.terca;
        roteiro.quarta = r.quarta;
        roteiro.quinta = r.quinta;
        roteiro.sexta = r.sexta;
        roteiro.sabado = r.sabado;
        roteiro.domingo = r.domingo;
        roteiro.observacao = r.observacao;
        return roteiro;
    }

}

