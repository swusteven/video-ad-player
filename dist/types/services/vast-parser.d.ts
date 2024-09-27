import { VastInformation } from './vast-model';
export declare class VastParser {
    getFromUrl(vastUrl: string): Promise<VastInformation>;
    getFromContent(vastText: string): VastInformation;
    private getInformation;
    private parseFile;
    private loadAdVerifications;
    queryXMLFile(data: Document | Element, field: string): string | undefined;
    queryXMLAttribute(data: Element | null, attributeId: string): string | undefined;
}
