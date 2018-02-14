import { database } from 'firebase';
import { Field } from 'app/modules/generic-catalogs/decorator/dynamic-catalog.decorator';

export class BaseGenericCatalog {
    key = 0;

    keysChanges: string[] = [];

    createdDate: Object;
    createdBy?: string;
    updatedDate?: Object;
    updatedBy?: string;

    constructor() {
        this.createdDate = database.ServerValue.TIMESTAMP;
    }

    hasChanges(compareWith: any): boolean {
        let response: boolean = this.keysChanges.length === 0;
        this.keysChanges.forEach(key => {
            response = this[key] !== compareWith[key] ? true : response;
        });
        return response;
    }
}

export class GenericCatalog extends BaseGenericCatalog {
    @Field('C1') nombre: string;
    @Field('C2') keyFB?: string;

    constructor(key?: number, nombre?: string) {
        super();
        this.keysChanges = ['nombre'];
        this.key = key ? key : 0;
        this.nombre = nombre ? nombre : null;
    }
}

export class Status extends GenericCatalog {
    usoStatus: number;
}

export class Empresa extends GenericCatalog { }

export class Persona extends BaseGenericCatalog {
    @Field('C1', 101) nombre: string;
    @Field('C2', 102) apellidoPaterno: string;
    @Field('C3', 103) apellidoMaterno: string;
    @Field('C4', 104) fechaNacimiento: Date;
    @Field('C5', 105) sexo: number;

    public get nombreCompleto(): string {
        return `${this.nombre} ${this.apellidoPaterno ? this.apellidoPaterno : ''} ${this.apellidoMaterno ? this.apellidoMaterno : ''}`;
    }

    public get edad(): number{
        const diff = Date.now().valueOf() - this.fechaNacimiento.valueOf();
        const ageDate = new Date(diff);
        // 1970 is start year on JSms
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    constructor() {
        super();
        this.keysChanges = ['nombre', 'apellidoPaterno', 'apellidoMaterno', 'fechaNacimiento', 'sexo'];
        this.nombre = '';
        this.apellidoPaterno = '';
        this.apellidoMaterno = '';
    }
}
