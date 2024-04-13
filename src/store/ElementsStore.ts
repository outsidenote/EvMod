export class ElementExistsError extends Error { }

export interface IElementsStoreRecord {
    miroElementId: string,
    elementName: string,
    originalMiroElementId?: string
}

export interface IElementsStore {
    list(): IElementsStoreRecord[]
    getElementName(miroElementId: string): string | undefined
    getMiroElementId(elementName: string): string | undefined
    insertElement(record: IElementsStoreRecord): void
    deleteElement(elementName: string): void
    listCopies(miroElementId: string): IElementsStoreRecord[]
    getById(miroElementId: string): IElementsStoreRecord | undefined
}


export class ElementsStore implements IElementsStore {

    private store: IElementsStoreRecord[];

    constructor(store?: IElementsStoreRecord[]) {
        this.store = store || []
    }
    getById(miroElementId: string): IElementsStoreRecord | undefined {
        const result = this.list().filter(el => el.miroElementId === miroElementId);
        return result.length ? result[0] : undefined;
    }
    listCopies(miroElementId: string): IElementsStoreRecord[] {
        return this.list().filter(el => el.originalMiroElementId === miroElementId);
    }

    list(): IElementsStoreRecord[] {
        return this.store || [];
    }

    insertElement(record: IElementsStoreRecord): void {
        // if (this.store.some(({ elementName }) => elementName === record.elementName))
        // throw new ElementExistsError(record.elementName);
        const originalMiroElementId = this.getMiroElementId(record.elementName);
        this.store.push(Object.assign({}, record, { originalMiroElementId }));
    }
    deleteElement(miroElementId: string): void {
        const index = this.store.findIndex((record) => miroElementId === record.miroElementId)
        if (index === -1) return;
        this.store.splice(index, 1)
    }
    getElementName(miroElementId: string): string | undefined {
        const result = this.store.find(record => record.miroElementId === miroElementId)
        return result?.elementName;
    }
    getMiroElementId(elementName: string): string | undefined {
        const result = this.store.find(record => record.elementName === elementName && !record.originalMiroElementId)
        return result?.miroElementId;
    }

}