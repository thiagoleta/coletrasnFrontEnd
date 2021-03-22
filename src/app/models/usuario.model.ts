import { Perfil } from "./perfil.model";

export class Usuario {

    cod_Usuario: number;
    nome: string;
    email: string;
    perfil: Perfil; 
    senha: string;
    

    static fromJson(m: Usuario): Usuario {
        const usuario = new Usuario();
        usuario.cod_Usuario = m.cod_Usuario;
        usuario.nome = m.nome;        
        usuario.email = m.email;  
        usuario.perfil = m.perfil;
        usuario.senha = m.senha;  
        return usuario;
    }

}

