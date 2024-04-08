import type { Shape } from "@mirohq/websdk-types";
import { APP_STORE, ELEMENT_PAYLOAD_KEY } from "../consts";
import { EvModeElementStoreEventChangeTypeEnum, type EvModeElementStoreEvent, type IAppStore } from "../types/appStore.types";
import { EvModElementTypeEnum } from "../types/element.types";
import { ElementsStore, IElementsStore, IElementsStoreRecord } from "./ElementsStore";
import LiteEvent from "./LiteEvent";

type InternalStoreType = Map<EvModElementTypeEnum, IElementsStore>


const getEmptyStore = (): InternalStoreType => new Map(
    Object.keys(EvModElementTypeEnum).map(elementType => [elementType as EvModElementTypeEnum, new ElementsStore()])
)

export default class InMemoryStore implements IAppStore {
    private internalStore: InternalStoreType = new Map<EvModElementTypeEnum, IElementsStore>();
    private readonly onChangeHandlers = new LiteEvent<EvModeElementStoreEvent>();

    private async commit() {
        return miro.board.setAppData(APP_STORE, JSON.stringify(Array.from(this.internalStore.entries())));
        // return miro.board.setAppData(APP_STORE, JSON.stringify(Array.from(getEmptyStore().entries())));
    }

    async sync(): Promise<void> {
        const serializedAppData = await miro.board.getAppData(APP_STORE)
        this.internalStore = getEmptyStore();
        if (!serializedAppData) return;

        const entries: Array<[string, { store: Array<any> }]> = JSON.parse(serializedAppData);
        entries.forEach(([elementType, { store }]) => {
            const elementStore = new ElementsStore(store);
            this.internalStore.set(elementType as EvModElementTypeEnum, elementStore);
        })

        console.log('InMemStore: sync: internalStore:', this.internalStore)

    }

    get onChange() { return this.onChangeHandlers.expose(); }

    async delete(elementType: EvModElementTypeEnum, miroElementId: string) {
        const store = this.internalStore.get(elementType);
        if (!store) return;
        store.deleteElement(miroElementId);
        this.internalStore.set(elementType, store);
        await this.commit()
        this.onChangeHandlers.trigger({
            elementType,
            miroElementId,
            changeType: EvModeElementStoreEventChangeTypeEnum.Deleted
        });
    }

    list(elementType: EvModElementTypeEnum): IElementsStoreRecord[] | undefined {
        const store = this.internalStore.get(elementType);
        if (!store) return;
        return (store as IElementsStore).list();
    }

    async addElement(elementType: EvModElementTypeEnum, miroElementId: string, elementName: string): Promise<void> {
        const store = this.internalStore.get(elementType) || new ElementsStore();
        store.insertElement({ miroElementId, elementName });
        this.internalStore.set(elementType, store);
        await this.commit()
        this.onChangeHandlers.trigger({
            elementType,
            miroElementId,
            changeType: EvModeElementStoreEventChangeTypeEnum.Added
        });
    }

    async addElementPayload(elementType: EvModElementTypeEnum, miroElementId: string, payload: any): Promise<void> {
        const store = this.internalStore.get(elementType);
        if (!store || !store.getElementName(miroElementId)) throw new Error('element does not exist');
        const element = await miro.board.getById(miroElementId);
        await (element as Shape).setMetadata(ELEMENT_PAYLOAD_KEY, payload)
    }
    getElementName(elementType: EvModElementTypeEnum, miroElementId: string): string | undefined {
        const store = this.internalStore.get(elementType);
        return store?.getElementName(miroElementId)
    }
    getMiroElementId(elementType: EvModElementTypeEnum, elementName: string): string | undefined {
        const store = this.internalStore.get(elementType);
        return store?.getMiroElementId(elementName);
    }
    async getElementPayload(elementType: EvModElementTypeEnum, miroElementId: string): Promise<any | undefined> {
        const store = this.internalStore.get(elementType);
        if (!store?.getElementName(miroElementId)) return;
        const element = await miro.board.getById(miroElementId);
        return (element as Shape).getMetadata(ELEMENT_PAYLOAD_KEY)
    }

}