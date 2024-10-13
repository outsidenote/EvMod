import {
  Box,
  Button,
  Card,
  OutlinedInput,
  Stack,
  Typography,
} from "@mui/material";
import {
  EvModElementTypeEnum,
  IElementMetadata,
} from "../../types/element.types";
import { useContext, useState } from "react";
import { Context } from "../MainLayout";
import { Frame, Image, Shape } from "@mirohq/websdk-types";
import { ELEMENT_METADATA_KEY } from "../../consts";
import { getColors, getMetadata } from "./helper";

export const RenameElement = ({
  metadata,
  onSubmit,
}: {
  metadata: IElementMetadata;
  onSubmit: () => void;
}) => {
  const { elementName, elementType } = metadata;
  const [store] = useContext(Context);
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");

  const getOptions = (type: EvModElementTypeEnum) => {
    return (
      store
        .list(type)
        .filter(
          (val, index, self) =>
            index === self.findIndex((v) => v.elementName === val.elementName)
        )
        .map((val) => {
          return val.elementName;
        }) ?? []
    );
  };

  const handleRenameSubmit = async () => {
    setError("");
    if (newName.length === 0) return setError("Element name cannot be empty");
    const options = getOptions(metadata.elementType);
    if (options.includes(newName))
      return setError("Element name already exists");

    const elements = (await miro.board.get()).filter(
      (elm: any) => elm.type === "shape" && elm.content.includes(elementName)
    ) as Shape[];
    for (let elm of elements) {
      const elementMetadata = await getMetadata(elm);
      if (
        elementMetadata &&
        elementMetadata.elementType === metadata.elementType
      ) {
        elm.content = `<p>${newName}</p>`;
        elm.setMetadata(
          ELEMENT_METADATA_KEY,
          JSON.stringify(
            Object.assign({}, elementMetadata, { elementName: newName })
          )
        );
        await elm.sync();
        await store.rename(
          metadata.elementType,
          elm.id,
          metadata.elementName,
          newName
        );
      }
    }
    setNewName("");
    onSubmit();
  };

  return (
    <Card sx={{ width: "100%", padding: "10px", marginTop: "20px" }}>
      <Stack flexDirection="column" alignItems="flex-start" gap="15px">
        <Typography sx={{ color: "black", fontSize: "18px" }}>
          Renaming:
        </Typography>

        <Stack
          sx={{
            ...getColors(elementType),
            width: "100%",
            aspectRatio: "1",
            height: "80px",
            overflow: "hidden",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "5px",
          }}
        >
          {elementName}
        </Stack>
        <Box position="relative" width="100%">
          <OutlinedInput
            placeholder="Insert new name"
            fullWidth
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key.toLocaleLowerCase() === "enter") handleRenameSubmit();
            }}
          />
          {error && (
            <Typography
              color="error"
              fontSize="13px"
              fontWeight={600}
              sx={{
                lineHeight: "0",
                position: "absolute",
                bottom: "10px",
                right: "5px",
              }}
            >
              {error}
            </Typography>
          )}
        </Box>
        <Button
          variant="outlined"
          color="info"
          type="button"
          onClick={handleRenameSubmit}
        >
          Rename
        </Button>
      </Stack>
    </Card>
  );
};
