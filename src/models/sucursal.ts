export interface Company {
  key: number;
  name: string;
}

export interface Sucursal {
  key: number;
  nombre: string;
  domicilioUuid?: number;
  company?: Company;
}
