import { BaseGenericCatalog, GenericCatalog } from 'app/modules/base/models/base.models';
import { Field } from 'app/modules/generic-catalogs/decorator/dynamic-catalog.decorator';

export class MarcaArmazon extends GenericCatalog {
    categoria: GenericCatalog;

    constructor(){
        super();
        this.categoria = new GenericCatalog();
    }
}

export class TipoArmazon extends BaseGenericCatalog {
    @Field('C1') nombre: string;
    @Field('C2') exportKey: number
    
    constructor(){
        super();
    }
}

export class ModeloArmazon extends GenericCatalog {
    categoria?: GenericCatalog;
    marca: MarcaArmazon;
    marcaID?: number;
    modeloID?: number = 0;
    tipoArmazonID?: number = 0;
    sku?: string;
    constructor(){
        super();
        this.marca = new MarcaArmazon();
        this.categoria = new GenericCatalog();
    }
}

export class MedidasArmazon {
    //Medidas basicas
    anguloNP_D: number;
    anguloNP_I: number;
    altura: number;
    distanciaVertex: number;
    iniciales: number;
    anguloPanoramico: number;
    anguloPantoscopico: number;
    //Armazon
    A: number;
    B: number;
    ED: number;
    DBL: number;
}