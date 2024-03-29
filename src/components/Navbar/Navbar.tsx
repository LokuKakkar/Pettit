import { Flex,Icon,Image } from '@chakra-ui/react';
import React from 'react';
import SearchInput from './SearchInput';
import RightContent from './RightContent/RightContent';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase/clientApp';
import Directory from './Directory/Directory';
import useDirectory from '../../hooks/useDirectory';
import { defaultMenuItem } from '../../atoms/DirectoryMenuAtom';
import {PiDogDuotone, PiDogFill} from "react-icons/pi"


const Navbar:React.FC = () => {
    
    const [user,loading,error] = useAuthState(auth);

    const {onSelectMenuItem} = useDirectory();


    return (
        <Flex bg="#1a1a1b" height="52px" padding="6px 12px"  justify={{md: "space-between"}} borderBottom="1px solid #1a282d" pb={4}  >
            <Flex align="center" width={{base:"40px" , md: "auto"}} mr={{base:0 , md:2}}  onClick={() => onSelectMenuItem(defaultMenuItem)} cursor="pointer" >
                <Icon as={PiDogDuotone} color="red" fontSize={{base: "18pt", md: "28pt" }} />
                <Image src="/images/PettitLogoText3.png" height='34px' align="center" pb="2px" display={{base: "none" , md: "unset"}} />
            </Flex>
            {user && <Directory />}
            <SearchInput user={user} />
            <RightContent user={user} />
        </Flex>
    )
}
export default Navbar;