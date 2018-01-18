import { BaseGenericCatalog, GenericCatalog } from "app/modules/base/models/base.models";

export class StoreProcedureMetaData extends GenericCatalog {
    description: string;
    options: StoreProcedureOptionMetaData[];
    constructor() {
        super();
    }
}

export class StoreProcedureOptionMetaData extends GenericCatalog {
    description: string;
    opcion: number;
    allowAll: boolean;
    storeProcedureID: number;
    constructor() {
        super();
    }
}