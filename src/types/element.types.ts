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


