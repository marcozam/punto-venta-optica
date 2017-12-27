import { BaseGenericCatalog, GenericCatalog } from '../../generic-catalogs/models/generic-catalogs.models';

export class TipoMica extends GenericCatalog {
    tipoMica: string;
    esBifocal: boolean;
}

export class MaterialMica extends GenericCatalog {
    
}

export class TratamientoMica extends GenericCatalog{
    productID: number;
}

export class TratamientoMicaPrecios{ 
    constructor(
        public tratamiento: TratamientoMica,
        public precio: number) { }
}

export class Ojo {
    distanciaInterPupilar?: number;
    esfera: number;
    cilindro: number;
    grados: number;
    
    constructor(){
        this.esfera = 0;
        this.cilindro = 0;
        this.grados = 0;
    }
}

export class Examen extends BaseGenericCatalog {
    ojoDerecho: Ojo;
    ojoIzquierdo: Ojo;
    tipoMicaRecomendadoID: string;
    tipoMicaRecomendado: string;
    materialRecomendadoID: string;
    materialRecomendado: string;
    
    //En caso de que el tipo de lente no sea monofocal
    adicion?: number;
    altura?: number;

    esReceta?: boolean;
    oftalmologo?: string = '';
    observaciones: string = '';

    constructor(){
        super();

        this.ojoDerecho = new Ojo();
        this.ojoIzquierdo =  new Ojo();
        this.tipoMicaRecomendadoID = '0';
        this.materialRecomendadoID = '0';
    }
}