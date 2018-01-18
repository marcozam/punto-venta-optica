import { Venta } from "app/modules/venta/models/venta.models";

export interface GeneralTicket {
    getServerData(key: number);
    createContent(): string;
    createHeader(): string;
    createFooter(): string;
    print();
}