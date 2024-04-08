import {
    EvModElementTypeEnum,
} from './element.types'
import { ILiteEvent } from '../store/LiteEvent'
import { IElementsStoreRecord } from '../store/ElementsStore'



export enum EvModeElementStoreEventChangeTypeEnum {
    Deleted = 'Deleted',
    Added = 'Added'
}
export interface EvModeElementStoreEvent {
    miroElementId: string,
    elementType: EvModElementTypeEnum,
    changeType: EvModeElementStoreEventChangeTypeEnum
}
export interface IAppStore {
    sync(): void

    addElement(elementType: EvModElementTypeEnum, miroElementId: string, elementName: string): void
    addElementPayload(elementType: EvModElementTypeEnum, miroElementId: string, payload: any): void

    getElementName(elementType: EvModElementTypeEnum, miroElementId: string): string | undefined
    getMiroElementId(elementType: EvModElementTypeEnum, elementName: string): string | undefined
    getElementPayload(elementType: EvModElementTypeEnum, miroElementId: string): any | undefined

    delete(elementType: EvModElementTypeEnum, miroElementId: string): any | undefined

    list(elementType: EvModElementTypeEnum): IElementsStoreRecord[] | undefined

    onChange: ILiteEvent<EvModeElementStoreEvent>
}

export type AppStoreType = Partial<IAppStore>