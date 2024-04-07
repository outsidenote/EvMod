import Immutable from 'immutable'
interface eventsCatalogItem {
    elementId: string
    elementName: string
}

export type eventsCatalog = Immutable.Map<string, eventsCatalogItem>