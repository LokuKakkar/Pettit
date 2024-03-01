import { Menu, MenuButton, Button, MenuList, MenuItem, Icon, Flex, MenuDivider, Text } from '@chakra-ui/react';
import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { User, signOut } from 'firebase/auth';
import {FaRedditSquare} from "react-icons/fa"
import  {VscAccount} from "react-icons/vsc"
import {IoSparkles } from "react-icons/io5"
import {CgProfile} from "react-icons/cg"
import {MdOutlineLogin} from "react-icons/md"
import { auth } from '../../../firebase/clientApp';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import { AuthModalState } from '../../../atoms/authModalAtom';
import { CommunityState } from '../../../atoms/communitiesAtom';
import { PiDogDuotone } from 'react-icons/pi';

type UserMenuProps = {
    user?: User | null; 
};

const UserMenu:React.FC<UserMenuProps> = ({user}) => {
    const setAuthModalState = useSetRecoilState(AuthModalState);

    const logout = async() => {
        await signOut(auth);
        // Clear community state;

    }

    return (
        <Menu>
            <MenuButton cursor="pointer" padding="0px 6px" borderRadius={4}
            _hover={{ outline:"1px solid" , outlineColor:"#1a282d" }}  >
                <Flex align="cener"  >
                    <Flex align="cener" > 
                        
                        {user? (
                                <>
                                <Icon as={PiDogDuotone} color="white" fontSize={24} mr={1} />
                                <Flex direction="column" display={{base:"none" , lg: "flex"}} fontSize={8} align="flex-start" mr={8}  >
                                    <Text fontWeight={700}>  
                                        {user?.displayName || user?.email?.split('@')[0] }
                                    </Text>
                                    <Flex>
                                        <Icon as={IoSparkles} color="brand.100" mr={1} />
                                        <Text color="white" > 1 Karma </Text>
                                    </Flex>
                                </Flex>



                                </>
                        )
                        : <Flex>
                            <Icon as={VscAccount} color="gray.400" fontSize={24} mr={1} />
                        </Flex> }

                    </Flex>
                    <ExpandMoreIcon />
                </Flex>
            </MenuButton>

            <MenuList bg="#1a282d"  >
                {user ? 
                <>
                    <MenuItem bg="#1a282d" fontSize="10pt" fontWeight={700} 
                    _hover={{bg:"blue.500" , color: "white" }}> 
                        <Flex align="center">
                            <Icon as={CgProfile} fontSize={20} mr={2} /> Profile
                        </Flex>
                    
                    </MenuItem>

                    <MenuDivider />
                    
                    <MenuItem bg="#1a282d" fontSize="10pt" fontWeight={700} 
                    _hover={{bg:"blue.500" , color: "white" }}  onClick={logout} > 
                        <Flex align="center">
                            <Icon as={MdOutlineLogin} fontSize={20} mr={2} /> Log Out
                        </Flex>
                    
                    </MenuItem>   
                </>
                :

                <>
                    <MenuItem bg="#1a282d" fontSize="10pt" fontWeight={700} 
                    _hover={{bg:"blue.500" , color: "white" }}  onClick={()=> setAuthModalState({open:true , view: "login"}) } > 
                        <Flex align="center">
                            <Icon as={MdOutlineLogin} fontSize={20} mr={2} /> Log In
                        </Flex>
                    
                    </MenuItem>  
                </>
                }




            </MenuList>
        </Menu>


    )
}
export default UserMenu;