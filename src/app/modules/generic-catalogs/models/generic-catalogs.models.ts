import { GenericCatalog } from 'app/modules/base/models/base.models';

export interface FieldProperty{
    key: number,
    propertyName: string,
    propertyType?: string,
    serverField: string,
    sendField: string,
    converter: any
}

export class Sucursal extends GenericCatalog {
    companyName: string = 'OPTIKA INFANTIL';
}