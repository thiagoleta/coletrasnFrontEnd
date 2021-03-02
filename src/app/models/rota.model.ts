export class Rota {
    cod_Rota: number;
    nome: string;
    composicao_Rota: string;
    flag_Ativo: boolean;
    observacao: string;

    static fromJson(r: any): Rota {
        const rota = new Rota();
        rota.cod_Rota = r.cod_Rota;
        rota.nome = r.nome;
        rota.composicao_Rota = r.composicao_Rota;
        rota.flag_Ativo = r.flag_Ativo;
        rota.observacao = r.observacao;
        return rota;
    }

}

