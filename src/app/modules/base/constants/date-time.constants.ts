import { Periodo } from 'app/modules/base/models/time-frame.models';
import { GenericCatalog } from 'app/modules/base/models/base.models';

export const periodos: Periodo[] = [
    new Periodo(1, 'Hoy'),
    new Periodo(2, 'Ayer'),
    new Periodo(3, 'Ultimos 2 Dias'),
    new Periodo(4, 'Esta Semana'),
    new Periodo(5, 'La semana pasada'),
    new Periodo(6, 'Ultimas 2 Semanas'),
    new Periodo(7, 'Mes en especifico'),
]

export const months: GenericCatalog[] = [ 
    new GenericCatalog( 1, 'Enero'),
    new GenericCatalog( 2, 'Febrero'),
    new GenericCatalog( 3, 'Marzo'),
    new GenericCatalog( 4, 'Abril'),
    new GenericCatalog( 5, 'Mayo'),
    new GenericCatalog( 6, 'Junio'),
    new GenericCatalog( 7, 'Julio'),
    new GenericCatalog( 8, 'Agosto'),
    new GenericCatalog( 9, 'Septiembre'),
    new GenericCatalog(10, 'Octubre'),
    new GenericCatalog(11, 'Noviembre'),
    new GenericCatalog(12, 'Diciembre'),
  ]