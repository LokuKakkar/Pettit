import React from "react";
import { Flex, Icon, Text, Stack, Button } from "@chakra-ui/react";
import { GiCheckedShield } from "react-icons/gi";
import { PiMusicNoteFill } from "react-icons/pi";
import Link from "next/link";


const Premium: React.FC = () => {
  return (
    <Flex
      direction="column"
      bg="#1a282d"
      borderRadius={4}
      
      p="12px"
      border="1px solid"
      borderColor="gray.300"
    >
      <Flex mb={2}>
        <Icon as={PiMusicNoteFill} fontSize={26} color="green.500" mt={2} />
        <Stack spacing={1} fontSize="9pt" pl={2}>
          <Text fontWeight={600}>Lyrify App</Text>
          <Text>Try our other application, with Lyrics for everyone</Text>
        </Stack>
      </Flex>
        <Button height="30px" bg="green.500" >
      <a href="https://github.com/LokuKakkar/Lyrify" target="_blank" >
            Try Now
      </a>
        </Button>
    </Flex>
  );
};
export default Premium;