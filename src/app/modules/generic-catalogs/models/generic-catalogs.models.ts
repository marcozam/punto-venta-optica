import { database } from 'firebase';

export class BaseGenericCatalog {
    key: string | number;

    keysChanges?: string[] = [];

    createdDate: Object;
    createdBy?: string;
    updatedDate?: Object;
    updatedBy?: string;

    constructor(){
        this.createdDate = database.ServerValue.TIMESTAMP;
    }

    hasChanges?(compareWith: any): boolean{
        let response: boolean = false;
        this.keysChanges.forEach(key=>{
            response = this[key] !== compareWith[key] ? true : response;
        })
        return response;
    }
}

export class GenericCatalog extends BaseGenericCatalog {
    nombre: string
}

export class Status extends GenericCatalog {
    usoStatus: number;
}

export class Sucursal extends GenericCatalog {
    companyName: string = 'ASOCIACION OPTIKA';
}

export class Empresa extends GenericCatalog {
    
}

export class Persona extends GenericCatalog {
    apellidoPaterno: string;
    apellidoMaterno?: string;
    fechaNacimiento: Date;
    sexo: number;

    public get nombreCompleto(): string {
        return `${this.nombre} ${this.apellidoPaterno ? this.apellidoPaterno: ''} ${this.apellidoMaterno ? this.apellidoMaterno: ''}`;
    }

    public get edad(): number{
        let diff = Date.now().valueOf() - this.fechaNacimiento.valueOf();
        let ageDate = new Date(diff);
        //1970 is start year on JSms
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    constructor(){
        super();
        this.nombre = '';
        this.apellidoPaterno = '';
        this.apellidoMaterno = '';
    }
}