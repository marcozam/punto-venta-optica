import { FieldProperty } from "app/modules/generic-catalogs/models/generic-catalogs.models";
import * as moment from 'moment';

const DefaultConverter = (value: any) => { return value; }

export const DateConverter = (value: any) => {
    if (value === null || value === undefined || value instanceof Date) return value;
    return moment(value).toDate();
}

export const BooleanConverter = (value: any) => {
    if (value === null || value === undefined || typeof value === "boolean") return value;
    return value.toString() === "true";
}

export const NumberConverter = (value: any) => {
    let rValue = value;
    if (!(value === null || value === undefined || typeof value === "number"))
        rValue = parseFloat(value.toString());
    return Math.floor((rValue*100)/100);
}


export function Field(dbField: string, dbFieldKey: number = 0, saveField?: string){
    return function (target: any, propertyKey: string) {
        let metadata = (<any>Reflect).getMetadata("design:type", target, propertyKey);
        let converter = DefaultConverter;
        switch(metadata.name){
            case 'Boolean':
                converter = BooleanConverter;
                break;
            case 'Number':
                converter = NumberConverter;
                break;
            case 'Date':
                converter = DateConverter;
                break;
        }

        let fieldMetadata: FieldProperty = {
            key: dbFieldKey,
            propertyName: propertyKey,
            serverField: dbField,
            sendField: saveField ? saveField : dbField,
            converter: converter
        };
        let dbGetter = () => fieldMetadata;
        Object.defineProperty(target, `${propertyKey}__dbData`, {
            get: dbGetter,
            enumerable: true
        });

        let definition = Object.getOwnPropertyDescriptor(target, propertyKey);
        if (definition) {
            Object.defineProperty(target, propertyKey, {
                get: definition.get,
                set: newValue => { definition.set(converter(newValue)); },
                enumerable: true,
                configurable: true
            });
        } else {
            Object.defineProperty(target, propertyKey, {
                get: function () { return this["__" + propertyKey]; },
                set: function (newValue) { this["__" + propertyKey] = converter(newValue); },
                enumerable: true,
                configurable: true
            });
        }
    };
}

export function getFields(item: any){
    let fields: FieldProperty[] = [];
    for (let prop in item) {
        let idx = prop.indexOf('__dbData');
        if(idx >= 0) fields.push(item[prop]);
    }
    return fields;
}