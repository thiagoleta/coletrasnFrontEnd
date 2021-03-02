export class Material {
    cod_Material: number;
    descricao: string;
    volume: string;
    observacao: string;
    material_Coletado: string;

    static fromJson(m: Material): Material {
        const material = new Material();
        material.cod_Material = m.cod_Material;
        material.descricao = m.descricao;
        material.volume = m.volume;
        material.observacao = m.observacao;
        material.material_Coletado = m.material_Coletado;
        return material;
    }

}

