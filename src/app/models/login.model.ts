export class Login {
    email: string;
    senha: string;

    static fromJson(l: Login): Login {
        const login = new Login();
        login.email = l.email;
        login.senha = l.senha;
        return login;
    }

}
