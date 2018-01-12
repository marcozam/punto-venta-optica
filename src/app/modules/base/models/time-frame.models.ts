import * as moment from 'moment';
import { GenericCatalog } from "app/modules/generic-catalogs/models/generic-catalogs.models";

export class Periodo extends GenericCatalog { 
    constructor(_key: number, _nombre: string){
        super();
        this.key = _key;
        this.nombre = _nombre;
    }

    getTimeFrame(){
        let fechaInicio = moment(new Date());
        let fechaFin = moment(fechaInicio);
    
        switch(this.key){
            case 2:
                fechaInicio.subtract(1, 'days');
                fechaFin.subtract(1, 'days');
                break;
            case 3:
                fechaInicio.subtract(2, 'days');
                fechaFin.subtract(1, 'days');
                break;
            case 4:
            case 5:
            case 6:
                fechaInicio.startOf('isoWeek');
                fechaFin = moment(fechaInicio).add(6, 'days');
                break;
            case 7:
            case 8:
                fechaInicio.startOf('month');
                fechaFin.endOf('month').subtract(1, 'days');
                break;
        }
        switch(this.key){
            case 5:
            case 6:
                fechaInicio.subtract(1, 'week');
                if(this.key === 5)
                    fechaFin.subtract(1, 'week');
                break;
            case 8:
                fechaInicio.subtract(1, 'month');
                fechaFin.subtract(1, 'month');
                break;
        }
        return { start: fechaInicio.toDate(), end: fechaFin.toDate()}
    }
}

export const periodos: Periodo[] = [
    new Periodo(1, 'Hoy'),
    new Periodo(2, 'Ayer'),
    new Periodo(3, 'Ultimos 2 Dias'),
    new Periodo(4, 'Esta Semana'),
    new Periodo(5, 'La semana pasada'),
    new Periodo(6, 'Ultimas 2 Semanas'),
    new Periodo(7, 'Este mes'),
    new Periodo(8, 'Mes pasado'),
]