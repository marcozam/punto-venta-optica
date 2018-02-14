import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
// Services
import { BaseAjaxService } from 'app/modules/base/services/base-ajax.service';
import { GenericServiceBase, GenericService } from 'app/modules/generic-catalogs/services/generic.service';
import { PersonasService } from 'app/modules/base/services/personas.service';
// Models
import { TipoDatosContacto, Contacto, DatoContacto } from 'app/modules/crm/models/crm.models';
import { Persona } from 'app/modules/base/models/base.models';

@Injectable()
export class ContactoService extends GenericService<Contacto> implements GenericServiceBase<Contacto> {

    constructor(_db: BaseAjaxService,
        private personaService: PersonasService) {
        super(_db);
    }

    newInstance() { return new Contacto(); }

    getPersonaByName(apellido: string, nombre: string) {
        this.startLoading();
        const params = this.db.createParameter('CRM0001', 4, { V3: apellido.trim(), V4: nombre.trim(), V5: '' });
        const $sub = this.db.getData(params).subscribe((result: any) => {
            $sub.unsubscribe();
            this.source$.next(
                result.Table.map(item => {
                    const cnt = new Contacto();
                    cnt.key = item.C0;
                    cnt.tipoID = 1;
                    cnt.persona = new Persona();
                    cnt.persona.key = item.C1;
                    cnt.persona.nombre = item.C2;
                    cnt.persona.apellidoPaterno = item.C3;
                    cnt.persona.apellidoMaterno = item.C4;
                    return cnt;
                })
            );
            this.finishLoading();
        });
    }

    getByID(ID: number) {
        const respone: Subject<Contacto> = new Subject();
        const params = this.db.createParameter('CRM0001', 2, { V3: 0, V4: ID});
        this.db.getData(params)
            .subscribe((result: any) => {
                let contacto = result.Table[0];
                if (contacto) {
                    contacto = this.mapData(contacto);
                    contacto.datos = result.Table1.map(t => this.mapDatosData(t));
                    if (contacto.tipoID === 1) {
                        this.personaService.getByID(contacto.referenceID)
                            .subscribe((persona: Persona) => {
                                contacto.persona = persona;
                                respone.next(contacto);
                            });
                    } else { respone.next(contacto); }
                }
            });
        return respone.asObservable();
    }

    mapDatos2Server(list: DatoContacto[]) {
        return list.map(dc => {
            return `${dc.tipoContactoID},${dc.valor},${dc.nombre}`;
        });
    }

    save(item: Contacto) {
        let DCA = [];
        DCA.push('C0,C1,C2');
        DCA = DCA.concat(this.mapDatos2Server(item.datos));

        const tParams = this.db.createParameter('CRM0001', 1, {
            V3: item.tipoID,
            V4: item.tipoID === 1 ? item.persona.key : item.empresa.key,
            V7: DCA.join('&')
        });
        return this.db.getData(tParams).map((result: any) => {
            const newItem = this.mapData(result.Table[0]);
            item.key = newItem.key;
            return item;
        });
    }

    mapData(object: any): Contacto {
        const item = new Contacto();
        item.key = object.C0;
        item.referenceID = object.C1;
        item.tipoID = object.C2;
        return item;
    }

    mapDatosData(object): DatoContacto {
        const item = new DatoContacto();
        item.key = object.C0;
        item.valor = object.C1;
        item.tipoContactoID = object.C2;
        item.nombre = object.C3;
        return item;
    }

    getTiposDatoContacto(callback) {
        this.db.getAllDataFromCatalog(501, res => {
            callback(res.map(it => {
                const tdc = new TipoDatosContacto();
                tdc.key = it.C0;
                tdc.nombre = it.C1;
                tdc.maxLength = it.C4;
                tdc.placeholder = it.C3;
                return tdc;
            }));
        });
    }
}
