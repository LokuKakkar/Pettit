import { Flex, Icon, Image, Menu, MenuButton, MenuList, Text } from '@chakra-ui/react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React from 'react';
import { useSetRecoilState } from 'recoil';
import { AuthModalState } from '../../../atoms/authModalAtom';
import {TiHome} from "react-icons/ti"
import Communities from './Communities';
import useDirectory from '../../../hooks/useDirectory';

const UserMenu:React.FC = () => {
    
    const setAuthModalState = useSetRecoilState(AuthModalState);

    const {directoryState, toggleMenuOpen} = useDirectory();

    return (
        <Menu isOpen={directoryState.isOpen} >
            <MenuButton cursor="pointer" padding="0px 6px" borderRadius={4} onClick={toggleMenuOpen}
            _hover={{ outline:"1px solid" , outlineColor:"#1a282d" }} mr={2} ml={{base:0 , md:2}}   >
                <Flex align="cener" justify="space-between" width={{base:"auto" , lg: "200px"}}  >
                    <Flex align="cener" > 

                        {directoryState.selectedMenuItem.imageURL ? (
                            <Image src={directoryState.selectedMenuItem.imageURL} borderRadius="fill" boxSize={"24px"} mr={2}   />
                        ) : (
                            
                            <Icon fontSize={24} mr={{base: 1 , md: 2}} as={directoryState.selectedMenuItem.icon} color={directoryState.selectedMenuItem.iconColor}  />
                        )}

                        <Flex display={{base: "none" , lg: "flex"}}  >
                            <Text fontWeight={700} fontSize="10pt" >
                                {directoryState.selectedMenuItem.displayText} 
                            </Text>
                        </Flex>
                    </Flex>
                    <ExpandMoreIcon />
                </Flex>
            </MenuButton>

            <MenuList bg="#1a282d"  >
                <Communities />
                
            </MenuList>
        </Menu>


    )
}
export default UserMenu;