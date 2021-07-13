
import { Cliente } from "./cliente.model";
import { Material } from "./material.model";
import { MesReferencia } from "./mesreferencia.model";
import { Motorista } from "./motorista.model";

export class Os {
    cod_OS : number;
    data_Geracao?: Date;
    cliente: Cliente;
    mesReferencia: MesReferencia;
    material: Material;   
    motorista: Motorista;    
    quantidade_Coletada: number;
    data_Coleta?: Date;
    flag_Coleta: string;
    flag_Envio_Email?: boolean;
    flag_Cancelado?: boolean;
    motivo_Cancelamento: boolean;
    data_Cancelamento?: Date;
    hora_Entrada: string;
    hora_Saida: string;
    placa : string;

    descricaoTratada(): string {
        return this.flag_Coleta === 'S' ? this.flag_Coleta ='Sim' : this.flag_Coleta ='Não';
      }
    

    static fromJson(r: any): Os {
        const os = new Os();
        os.cod_OS = r.cod_OS;
        os.data_Geracao= r.data_Geracao;
        os.cliente = r.cliente;
        os.mesReferencia = r.mesReferencia;
        os.material = r.material;
        os.motorista = r.motorista;        
        os.quantidade_Coletada = r.quantidade_Coletada;
        os.data_Coleta = r.data_Coleta;
        os.flag_Coleta = r.flag_Coleta;
        os.flag_Envio_Email = r.flag_Envio_Email;
        os.flag_Cancelado = r.flag_Cancelado;
        os.motivo_Cancelamento = r.motivo_Cancelamento;
        os.data_Cancelamento = r.data_Cancelamento;
        os.hora_Entrada = r.hora_Entrada;
        os.hora_Saida = r.hora_Saida;
        os.placa = r.placa;
      
        return os;
    }

}

