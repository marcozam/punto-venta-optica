import { GenericCatalog } from "./generic-catalogs.models";

export class MetaDataTable{
    name: string;
    scheme: string;
}

export class MetaDataColumn{
    name: string;
    dbType: string;
    maxLength: number;
    position: number;
    isNullable: boolean;
    tipoCampoID: number;
    tipoDatoID: number;
}

export class MetaDataCatalog extends GenericCatalog {
    //Firebase
    referenceURL: string;
    //SQL
    dynamic?: boolean = true;
    tableName?: string;
    filterAccount?: boolean = false;
    //Navigation
    detailURL?: string;
    //Fields
    fields?: MetaDataField[] = [];
}

export class MetaDataField extends GenericCatalog {
    nombreCorto: string;
    catalogoID: number;
    tipoCampoID: number;
    orden: number;
    required: boolean;
    visible: boolean;
    fieldName: string;
    catalogoReferenciaID: number;
    displayMember: string;
    isNew?: boolean = true;
}