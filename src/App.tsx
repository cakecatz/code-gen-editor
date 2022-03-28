import {
  Button,
  HStack,
  Input,
  List,
  ListItem,
  Text,
  Textarea,
  VStack
} from "@chakra-ui/react";
import { camelCase, pascalCase, paramCase } from "change-case";
import { useCallback, useEffect, useState } from "react";
import localforage from "localforage";

export default function App() {
  const [items, setItems] = useState<string[]>([]);
  const [value, setValue] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const saveItems = useCallback(
    (data) => {
      setItems(data);
      localforage.setItem("items", data);
    },
    [setItems]
  );

  const saveInput = useCallback(
    (data) => {
      setInput(data);
      localforage.setItem("input", data);
    },
    [setInput]
  );

  useEffect(() => {
    setOutput(
      items
        .map((item) =>
          input
            .replace(/\[value\]/g, item)
            .replace(/\[pascal\]/g, pascalCase(item))
            .replace(/\[kebab\]/g, paramCase(item))
            .replace(/\[camel\]/g, camelCase(item))
        )
        .join("\n")
    );
  }, [items, input]);

  useEffect(() => {
    localforage.getItem("items").then((data) => {
      if (data) {
        setItems(data as string[]);
      }
    });
    localforage.getItem("input").then((data) => {
      if (data) {
        setInput(data as string);
      }
    });
  }, [setItems, setInput]);

  return (
    <VStack>
      <Text>
        Available case:{" "}
        <Text fontWeight="bold">[value] [pascal] [kebab] [camel]</Text>
      </Text>
      <HStack width="90vw">
        <Textarea
          height="50vh"
          value={input}
          fontFamily="monospace"
          onChange={(e) => saveInput(e.currentTarget.value)}
        />
        <Textarea height="50vh" fontFamily="monospace" value={output} />
      </HStack>

      <VStack>
        <HStack>
          <Input
            value={value}
            onChange={(e) => setValue(e.currentTarget.value)}
          />
          <Button
            onClick={() => {
              saveItems([value].concat(items));
              setValue("");
            }}
            disabled={items.some((v) => v === value)}
          >
            Add
          </Button>
        </HStack>
        <List spacing={2} width="100%">
          {items.map((item, index) => (
            <ListItem key={item}>
              <HStack justifyContent="space-between">
                <Text>{item}</Text>
                <Button
                  onClick={() => {
                    const cloneItems = [...items];
                    cloneItems.splice(index, 1);
                    saveItems(cloneItems);
                  }}
                >
                  Delete
                </Button>
              </HStack>
            </ListItem>
          ))}
        </List>
      </VStack>
    </VStack>
  );
}
