import type { Connector, Card, AppCard, Tag, Embed, Image, Preview, Shape, StickyNote, Text, Frame, Group, Unsupported, Json } from "@mirohq/websdk-types";

export enum EvModElementTypeEnum {
    Command = "Command",
    Event = "Event",
    ReadModel = "Read Model",
    Processor = "Processor",
    Screen = "Screen",
    Swimlane = "Swimlane",
    CommandHandler = "Command Handler",
    Projector = "Projector"
}

export interface IEventData {

}

export interface ICommandData {

}

export interface IReadModelData {
    schema: Json
    example: Json
}

export interface IElementMetadata {
    elementName: string,
    elementType: EvModElementTypeEnum
    copyOf?: string
}

export interface IElementData {
    elementType: EvModElementTypeEnum
    data?: ICommandData | IEventData | IReadModelData
}

export type MiroElementType = Connector | Card | AppCard | Tag | Embed | Image | Preview | Shape | StickyNote | Text | Frame | Group | Unsupported;

export type EvModEventPayloadType = any;
export type EvModCommandPayloadType = any;
export type EvModProcessorPayloadType = any;
export type EvModReadModelPayloadType = any;
export type EvModCommandHandlerPayloadType = any;
export type EvModElementPayloadType = EvModEventPayloadType | EvModCommandPayloadType | EvModProcessorPayloadType | EvModReadModelPayloadType | EvModCommandHandlerPayloadType;