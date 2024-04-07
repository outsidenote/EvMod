import Immutable from 'immutable'
export interface IEventsCatalogItem {
    elementId: string
    elementName: string
}

export type EventsCatalogType = Immutable.Map<string, IEventsCatalogItem>