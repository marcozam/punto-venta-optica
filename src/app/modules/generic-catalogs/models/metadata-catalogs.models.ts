import { GenericCatalog } from 'app/modules/base/models/base.models';
import { Field } from 'app/modules/generic-catalogs/decorator/dynamic-catalog.decorator';
import { FieldProperty } from 'app/modules/generic-catalogs/models/generic-catalogs.models';

export class MetaDataTable{
    @Field('C1') name: string;
    @Field('C2') scheme: string;
}

export class MetaDataColumn{
    @Field('C1') name: string;
    @Field('C2') dbType: string;
    @Field('C3') maxLength: number;
    @Field('C4') isNullable: boolean;
    @Field('C5') position: number;
    @Field('R1') tipoCampoID: number;
    @Field('R2') tipoDatoID: number;
}

export class MetaDataCatalog extends GenericCatalog {
    //SQL
    @Field('C1', 10001) nombre: string;
    @Field('C3', 10004) dynamic: boolean = true;
    @Field('C4', 10003) tableName?: string;
    @Field('C5', 10005) filterAccount: boolean = false;
    @Field('C6', 10006) detailURL?: string;
    @Field('C7', 10007) listURL?: string;
    
    //Firebase
    referenceURL: string;
    hybrid?: boolean = false;
    //Fields
    fields?: MetaDataField[] = [];

    constructor(){
        super();
        this.key = 0;
        this.tableName = '';
        this.keysChanges = ['nombre', 'tableName', 'dynamic', 'detailURL', 'listURL'];
    }
}

export class MetaDataField extends GenericCatalog {
    @Field('C1') nombre: string;
    @Field('C2') nombreCorto: string;
    @Field('C3') tipoCampoID: number;
    @Field('C4') catalogoReferenciaID: number;
    @Field('C5') displayMember: string;
    @Field('C6') required: boolean;
    @Field('C7') orden: number;
    @Field('C8') visible: boolean;
    @Field('C9') fieldName: string;
    //C10
    //C11
    @Field('C13') catalogoID: number;
    isNew?: boolean = true;
}