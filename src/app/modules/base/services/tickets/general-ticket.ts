export interface GeneralTicket {
    getServerData(key: number);
    createContent(): string;
    createHeader(): string;
    createFooter(): string;
    print();
}
