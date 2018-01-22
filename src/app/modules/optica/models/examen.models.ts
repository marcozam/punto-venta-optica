import { BaseGenericCatalog, GenericCatalog } from 'app/modules/base/models/base.models';
import { Field } from 'app/modules/generic-catalogs/decorator/dynamic-catalog.decorator';

export class TipoMica extends BaseGenericCatalog {
    @Field('C1', 100012) nombre: string;
    @Field('C2', 100013) tipoMica: number;
    @Field('C3', 100014) keyFB: string; //This should be removed once fully migrated to SQL}

    constructor(){
        super();
        this.keysChanges = ['nombre', 'tipoMica'];
    }
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