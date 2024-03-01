import React, { useState } from 'react';
import CreateCommunityModal from '../../Modal/Auth/CreateCommunity/CreateCommunityModal';
import { MenuItem, Flex, Icon, useStatStyles, Box, Text } from '@chakra-ui/react';
import { GrAdd } from 'react-icons/gr';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { CommunityState } from '../../../atoms/communitiesAtom';
import MenuListItem from './MenuListItem';
import { FaReddit } from 'react-icons/fa';

type CommunitiesProps = {
    
};

const Communities:React.FC<CommunitiesProps> = () => {
    const [open, setOpen] = useState(false);
    const mySnippets = useRecoilValue(CommunityState).mySnippets;


    return (
        <>
        <CreateCommunityModal open={open} handleClose={()=> setOpen(false)} />
        
        <Box mt={3} mb={4}>
            <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
                MODERATING
            </Text>


            {mySnippets.filter(snippet => snippet.isModerator).map((snippet) => (
                
                    <MenuListItem key={snippet.communityId} displayText={`r/${snippet.communityId}`} icon={FaReddit} link={`/r/${snippet.communityId}`} iconColor='blue.500' imageURL={snippet.imageURL}  />
                
            ))}
        </Box>


        <Box mt={3} mb={4}>
            <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
                MY COMMUNITIES
            </Text>

            <MenuItem width="100%" bg="#1a282d"  _hover={{bg:"blue.500" , color: "white" }} onClick={()=> setOpen(true)} >
                <Flex align="center" >
                    <Icon as={GrAdd} fontSize={20} mr={2} />
                    Create Community
                </Flex>
            </MenuItem>

            {mySnippets.map((snippet) => (
                
                    <MenuListItem key={snippet.communityId} displayText={`r/${snippet.communityId}`} icon={FaReddit} link={`/r/${snippet.communityId}`} iconColor='blue.500' imageURL={snippet.imageURL}  />
               
            ))}
        </Box>
        </>
    )
}
export default Communities;