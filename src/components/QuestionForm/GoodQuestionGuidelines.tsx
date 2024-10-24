import { Box, Text, List, ListItem, ListIcon } from "@chakra-ui/react";
import { CheckCircle, XCircle } from "lucide-react";

export const GoodQuestionGuidelines = () => (
  <Box p={4} borderRadius="lg">
    <Text fontSize="md" fontWeight="medium" mb={2}>
      How to Ask a Good Question:
    </Text>
    <List spacing={2} fontSize="sm">
      <ListItem>
        <ListIcon as={CheckCircle} color="green.500" />
        Be specific and focus on one topic
      </ListItem>
      <ListItem>
        <ListIcon as={CheckCircle} color="green.500" />
        Ask open-ended questions
      </ListItem>
      <ListItem>
        <ListIcon as={CheckCircle} color="green.500" />
        Frame positively, focus on what you can control
      </ListItem>
      <ListItem>
        <ListIcon as={XCircle} color="red.500" />
        Avoid repeating questions frequently
      </ListItem>
      <ListItem>
        <ListIcon as={XCircle} color="red.500" />
        Don't ask about others' private matters
      </ListItem>
    </List>
  </Box>
);
