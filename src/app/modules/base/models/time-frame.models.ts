import * as moment from 'moment';
import { GenericCatalog } from "app/modules/base/models/base.models";

export class OSMes extends GenericCatalog{
    constructor(_key: number, _nombre: string){
        super();
        this.key = _key;
        this.nombre = _nombre;
    }
}

export class OSPeriodo extends GenericCatalog { 
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