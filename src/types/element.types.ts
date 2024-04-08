    import type { Connector, Card, AppCard, Tag, Embed, Image, Preview, Shape, StickyNote, Text, Frame, Group, Unsupported } from "@mirohq/websdk-types";

export enum EvModElementTypeEnum {
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
    elementType: EvModElementTypeEnum
}

export interface IElementData {
    elementType: EvModElementTypeEnum
    data: ICommandData | IEventData
}

export type MiroElementType = Connector | Card | AppCard | Tag | Embed | Image | Preview | Shape | StickyNote | Text | Frame | Group | Unsupported;

export type EvModEventPayloadType = any;
export type EvModCommandPayloadType = any;
export type EvModProcessorPayloadType = any;
export type EvModReadModelPayloadType = any;
export type EvModCommandHandlerPayloadType = any;
export type EvModElementPayloadType = EvModEventPayloadType | EvModCommandPayloadType | EvModProcessorPayloadType | EvModReadModelPayloadType | EvModCommandHandlerPayloadType;