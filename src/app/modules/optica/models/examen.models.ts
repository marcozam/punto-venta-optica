import { BaseGenericCatalog } from 'app/modules/base/models/base.models';
import { Field } from 'app/modules/generic-catalogs/decorator/dynamic-catalog.decorator';

export class TipoMica extends BaseGenericCatalog {
    @Field('C1', 100012) nombre: string;
    @Field('C2', 100013) tipoMica: number;
    @Field('C3', 100014) keyFB: string;
    // This should be removed once fully migrated to SQL

    constructor() {
        super();
        this.keysChanges = ['nombre', 'tipoMica'];
    }
}

export class MaterialMica extends BaseGenericCatalog {
    @Field('C1', 100015) nombre: string;
    @Field('C2', 100016) keyFB: string;
}

export class TratamientoMica extends BaseGenericCatalog {
    @Field('C1') nombre: string;
    @Field('C2') keyFB: string;
    @Field('C3') productID: number;
}

export class Ojo {
    @Field('C1') esfera: number;
    @Field('C2') cilindro: number;
    @Field('C3') grados: number;
    @Field('C4') distanciaInterPupilar?: number;

    constructor() {
        this.esfera = 0;
        this.cilindro = 0;
        this.grados = 0;
    }
}

export class Examen extends BaseGenericCatalog {
    @Field('C1') pacienteID: number;
    @Field('C3') tipoMicaRecomendadoID: number;
    @Field('R3') tipoMicaRecomendado: string;
    @Field('C4') materialRecomendadoID: number;
    @Field('R4') materialRecomendado: string;
    @Field('C5') esReceta = false;
    // En caso de que el tipo de lente no sea monofocal
    @Field('C6') adicion?: number;
    @Field('C7') altura?: number;
    @Field('C8') observaciones = '';
    @Field('C9') oftalmologo = '';

    ojoDerecho: Ojo;
    ojoIzquierdo: Ojo;

    constructor() {
        super();

        this.ojoDerecho = new Ojo();
        this.ojoIzquierdo =  new Ojo();
        this.tipoMicaRecomendadoID = 1;
        this.materialRecomendadoID = 1;
    }
}

export class MicaPrecio {
    material: MaterialMica;
    tipoMica: TipoMica;

    tratamientos: TratamientoMicaPrecios[];

    constructor(public precioBase: number, public materialID: number, public tipoMicaID: number) { }
}

export class TratamientoMicaPrecios {
    tratamiento: TratamientoMica;

    constructor(public precio: number, public tratamientoID: number, public productID: number) { }
}
