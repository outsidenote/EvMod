import { Frame, Image, Shape } from "@mirohq/websdk-types";
import { EvModElementTypeEnum, IElementMetadata } from "../../types/element.types";
import { ELEMENT_METADATA_KEY } from "../../consts";

export const getColors = (elementType: EvModElementTypeEnum) => {
  switch (elementType) {
    case EvModElementTypeEnum.Event:
      return { backgroundColor: "#F5D22B", color: "#1A1A1A" };
    case EvModElementTypeEnum.Command:
      return { backgroundColor: "#2D9BF0", color: "#FFFFFF" };
    case EvModElementTypeEnum.ReadModel:
      return { backgroundColor: "#8FD14F", color: "#1A1A1A" };
    case EvModElementTypeEnum.Screen:
      return { backgroundColor: "#FFFFFF", color: "#000000" };
    default:
      return { backgroundColor: "#FFFFFF", color: "#000000" };
  }
};


export const getMetadata = async (element: Shape | Frame | Image) => {
    const metadataJson = await (element as Shape | Frame | Image).getMetadata(
      ELEMENT_METADATA_KEY
    );
    if (!metadataJson) return;
    return JSON.parse(metadataJson.toString()) as unknown as IElementMetadata;
  };
