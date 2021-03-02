export class Motorista {

    cod_Motorista: number;
    nome: string;
    ajudante1: string;
    ajudante2: string;
    telefone1: string;
    telefone2: string;
    placa: string;

    static fromJson(m: Motorista): Motorista {
        const motorista = new Motorista();
        motorista.cod_Motorista = m.cod_Motorista;
        motorista.nome = m.nome;
        motorista.ajudante1 = m.ajudante1;
        motorista.ajudante2 = m.ajudante2;
        motorista.telefone1 = m.telefone1;
        motorista.telefone2 = m.telefone2;
        motorista.placa = m.placa;
        return motorista;
    }

}

