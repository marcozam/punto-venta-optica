import { BaseGenericCatalog, GenericCatalog } from "app/modules/base/models/base.models";
import { Field } from "app/modules/generic-catalogs/decorator/dynamic-catalog.decorator";

export class StoreProcedureMetaData extends BaseGenericCatalog {
    @Field('C1', 29901) nombre: string;
    @Field('C2', 29902) description: string;
    
    options: StoreProcedureOptionMetaData[];

    constructor() {
        super();
    }
}

export class StoreProcedureOptionMetaData extends GenericCatalog {
    @Field('C1', 29801) storeProcedureID: number;
    @Field('C2', 29802) opcion: number;
    @Field('C3', 29803) description: string;
    @Field('C4', 29804) allowAll: boolean;

    constructor() {
        super();
    }
}