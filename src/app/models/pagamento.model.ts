import { Cliente } from "./cliente.model";
import { MesReferencia } from "./mesreferencia.model";


export class Pagamento {
    cod_Pagamento: number;
    cliente: Cliente;
    mesReferencia: MesReferencia;
    valor: number;
    data: Date;    


    static fromJson(r: any): Pagamento {
        const pagamento = new Pagamento();
        pagamento.cod_Pagamento = r.cod_Pagamento;
        pagamento.cliente = r.cliente;
        pagamento.mesReferencia = r.mesReferencia;
        pagamento.valor = r.valor;
        pagamento.data = r.data;              
        
        return pagamento;
    }

}

