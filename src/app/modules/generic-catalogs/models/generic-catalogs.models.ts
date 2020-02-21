export interface FieldProperty {
  key: number;
  propertyName: string;
  propertyType?: string;
  serverField: string;
  sendField: string;
  converter: any;
}
