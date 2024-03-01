import { Flex, Input, InputGroup, InputLeftElement, InputRightElement } from '@chakra-ui/react';
import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { User } from 'firebase/auth';

type SearchInputProps = {
    user?: User | null;

};

const SearchInput:React.FC<SearchInputProps> = ({user}) => {
    
    return (
        <Flex flexGrow={1} mr={2} align="center" ml={2} maxWidth={user ? "auto" : "600px"}  >
            <InputGroup>
                <InputLeftElement
                pointerEvents='none'
                 mb={1}
                >
                    <SearchIcon />
                </InputLeftElement>
                <Input placeholder='Search Pettit' fontSize="10pt" _placeholder={{color: "gray.500"}}  _hover={{ border: "1px solid", borderColor: "blue.500", }} 
                _focus={{outline: "none" , border: "1px solid", borderColor: "blue.500"}}  height="34px"  bg="#272729" border="1px solid gray" />
            </InputGroup>


        </Flex>
    )
}
export default SearchInput;