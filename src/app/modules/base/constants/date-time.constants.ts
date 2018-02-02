import { OSPeriodo, OSMes } from 'app/modules/base/models/time-frame.models';

export const periodos: OSPeriodo[] = [
    new OSPeriodo(1, 'Hoy'),
    new OSPeriodo(2, 'Ayer'),
    new OSPeriodo(3, 'Ultimos 2 Dias'),
    new OSPeriodo(4, 'Esta Semana'),
    new OSPeriodo(5, 'La semana pasada'),
    new OSPeriodo(6, 'Ultimas 2 Semanas'),
    new OSPeriodo(7, 'Mes en especifico'),
]

export const months: OSMes[] = [ 
    new OSMes( 1, 'Enero'),
    new OSMes( 2, 'Febrero'),
    new OSMes( 3, 'Marzo'),
    new OSMes( 4, 'Abril'),
    new OSMes( 5, 'Mayo'),
    new OSMes( 6, 'Junio'),
    new OSMes( 7, 'Julio'),
    new OSMes( 8, 'Agosto'),
    new OSMes( 9, 'Septiembre'),
    new OSMes(10, 'Octubre'),
    new OSMes(11, 'Noviembre'),
    new OSMes(12, 'Diciembre'),
  ]