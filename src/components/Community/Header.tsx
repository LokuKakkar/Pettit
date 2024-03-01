import React from 'react';
import { Community } from '../../atoms/communitiesAtom';
import { Box, Button, Flex, Icon, Image, Text } from '@chakra-ui/react';
import { FaReddit } from 'react-icons/fa';
import useCommunityData from '../../hooks/useCommunityData';
import { PiDogDuotone } from 'react-icons/pi';

type HeaderProps = {
    communityData: Community;
};

const Header:React.FC<HeaderProps> = ({communityData}) => {
    const {communityStateValue, onJoinOrLeaveCommunity, loading} = useCommunityData();
    const isJoined = !!communityStateValue.mySnippets.find(
        (item) => item.communityId === communityData.id
    )

    return (
        <Flex direction="column"  width="100%" height="146px">
            <Box  height="50%" bg="blue.400" />
            <Flex justify="center" bg="#1a1a1b" flexGrow={1}  >
                <Flex width="95%" maxWidth="860px" direction={{base : "row" , md : "column", sm: "row"}} >
                    
                    { communityStateValue?.currentCommunity?.imageUrl ?
                    <Image src={communityStateValue?.currentCommunity?.imageUrl}
                    borderRadius="full" boxSize="66px" alt="community image" position="relative" top={-3} color="blue.500" border="4px solid white" />
                      :
                      
                    <Icon as={PiDogDuotone} fontSize={64} position="relative" top={-3}
                    color="blue.500" border="4px solid white" borderRadius="50%"  />
                    }
                    <Flex  padding="10px 10px" >
                        <Flex direction="column" mr={5} >
                            <Text fontWeight={800} fontSize={{base: "11pt", md: "16pt" }} > {communityData?.id} </Text>
                            <Text fontWeight={600} fontSize={{base: "8pt", md: "10pt"}}  > r/{communityData?.id} </Text>
                        </Flex>
                        <Button variant={isJoined? "outline" : "solid"} 
                        height="30px" pr={4} pl={6} isLoading={loading}
                        onClick={() => onJoinOrLeaveCommunity(communityData, isJoined) }
                        >
                            {isJoined ? "Joined" : "Join" }
                        </Button>

                    </Flex>
                </Flex>
            </Flex>
            
        </Flex>
    )
}
export default Header;