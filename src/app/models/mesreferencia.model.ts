

export class MesReferencia {
    cod_MesReferencia: number;
    mesAno: string;
    dataInicio: Date;
    dataTermino: Date;
    ativo: Boolean;


    static fromJson(m: MesReferencia): MesReferencia {
        const mesRef = new MesReferencia();
        mesRef.cod_MesReferencia = m.cod_MesReferencia;
        mesRef.mesAno = m.mesAno;
        mesRef.dataInicio = m.dataInicio;
        mesRef.dataTermino = m.dataTermino;        
        return mesRef;
    }    



}


