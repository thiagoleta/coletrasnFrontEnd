import { Usuario } from "./usuario.model";

export class Perfil {
    cod_Perfil: number;
    nome_Perfil: string;
    
    

    static fromJson(m: Perfil): Perfil {
        const perfil = new Perfil();
        perfil.cod_Perfil = m.cod_Perfil;
        perfil.nome_Perfil = m.nome_Perfil;                
        return perfil;
    }

}

