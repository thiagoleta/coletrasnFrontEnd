

export class Cliente {
    cod_Cliente: number;
    cpF_CNPJ: string;
    nomeCompleto_RazaoSocial: string;
    fantasia: string;
    insc_Estadual: string;
    logradouro: string;
    endereco: string;
    bairro: string;
    complemento: string;
    cidade: string;
    cep: string;
    uF: string;
    telefones: string;
    funcao: string;
    email: string;
    flag_Ativo: string;
    observacao: string;
    referencia: string;

    get nomeTratado(): string {
        if (this.nomeCompleto_RazaoSocial.length <= 30) return this.nomeCompleto_RazaoSocial;
        return this.nomeCompleto_RazaoSocial.substring(0, 30) + '...';
    }

    //   get documento(): string {
    //     if (this.cpf !== null && this.cpf !== '') {
    //       const cpf = this.cpf.replace(/\D/g, '');
    //       return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, '\$1.\$2.\$3-\$4');
    //     }
    //     if (this.cnpj !== null && this.cnpj !== '') {
    //       const cnpj = this.cnpj.replace(/\D/g, '');
    //       return cnpj.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, '\$1.\$2.\$3/\$4-\$5');
    //     }
    //     return '';
    //   }

    static fromJson(c: Cliente): Cliente {
        const cliente = new Cliente();
        cliente.cod_Cliente = c.cod_Cliente;
        cliente.cpF_CNPJ = c.cpF_CNPJ;
        cliente.nomeCompleto_RazaoSocial = c.nomeCompleto_RazaoSocial;
        cliente.fantasia = c.fantasia;
        cliente.insc_Estadual = c.insc_Estadual;
        cliente.email = c.email;
        cliente.logradouro = c.logradouro;
        cliente.endereco = c.endereco;
        cliente.bairro = c.bairro;
        cliente.complemento = c.complemento;
        cliente.cidade = c.cidade;
        cliente.cep = c.cep;
        cliente.uF = c.uF;
        cliente.telefones = c.telefones;
        cliente.funcao = c.funcao;
        cliente.email = c.email;
        cliente.flag_Ativo = c.flag_Ativo;
        cliente.endereco = c.endereco;
        cliente.observacao = c.observacao;
        cliente.referencia = c.referencia;
        return cliente;




















    }
}
