export class Turno {

    cod_Turno: number;
    nome_Turno: string;
    

    static fromJson(m: Turno): Turno {
        const turno = new Turno();
        turno.cod_Turno = m.cod_Turno;
        turno.nome_Turno = m.nome_Turno;        
        return turno;
    }

}

