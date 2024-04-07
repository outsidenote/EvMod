    import type { Connector, Card, AppCard, Tag, Embed, Image, Preview, Shape, StickyNote, Text, Frame, Group, Unsupported } from "@mirohq/websdk-types";

export enum ElementTypeEnum {
    Command = "Command",
    Event = "Event",
    ReadModel = "Read Model",
    Processor = "Processor",
    Screen = "Screen",
    Swimlane = "Swimlane"
}

export interface IEventData {

}

export interface ICommandData {

}

export interface IElementMetadata {
    elementName: string,
    elementType: ElementTypeEnum
}

export interface IElementData {
    elementType: ElementTypeEnum
    data: ICommandData | IEventData
}

export type MiroElementType = Connector | Card | AppCard | Tag | Embed | Image | Preview | Shape | StickyNote | Text | Frame | Group | Unsupported;


