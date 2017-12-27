import { Venta } from "app/modules/venta/models/venta.models";

export interface GenericTicketService {
    //venta: Venta;
    getServerData(key: number);
    createContent(): string;
    createHeader(): string;
    createFooter(): string;
    print();
}