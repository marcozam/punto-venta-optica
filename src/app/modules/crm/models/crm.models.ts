import { 
    BaseGenericCatalog, 
    GenericCatalog, 
    Persona, 
    Empresa 
} from 'app/modules/base/models/base.models';

export class Contacto extends BaseGenericCatalog {
    key: number;
    tipoID: number;
    referenceID: number;
    persona?: Persona;
    empresa?: Empresa;
    datos: DatoContacto[];

    public get nombre(): string {
        return this.persona ? this.persona.nombreCompleto.toUpperCase() : this.empresa.nombre.toUpperCase();
    }

    constructor(){
        super();
        this.persona = new Persona();
        this.datos = [];
    }
}

export class DatoContacto extends GenericCatalog{
    contactoID: number;
    valor: string;
    tipoContactoID: number;
    tipoContacto?: TipoDatosContacto;
    
    constructor(){
        super();
    }

}

export class TipoDatosContacto extends GenericCatalog {
    placeholder: string;
    maxLength: number;

    constructor(){
        super();
    }
}