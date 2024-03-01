import React from 'react';
import PageContent from '../../../components/Layout/PageContent';
import { Box, Text } from '@chakra-ui/react';
import NewPostForum from '../../../components/Posts/NewPostForum';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebase/clientApp';
import { useRecoilValue } from 'recoil';
import { CommunityState } from '../../../atoms/communitiesAtom';
import About from '../../../components/Community/About';
import useCommunityData from '../../../hooks/useCommunityData';


const SubmitPostPage:React.FC = () => {
    const [user] = useAuthState(auth)
    // const communityStateValue = useRecoilValue(CommunityState);
    const {communityStateValue} = useCommunityData();

    return (
        <PageContent>
            {/* LHS */}
            <> 
            <Box p="14px 0px" borderBottom="1px solid gray"  >
                <Text>
                    Create a post
                </Text>
            </Box>
            {user && <NewPostForum user= {user} communityImageURL={communityStateValue.currentCommunity?.imageUrl} />}
            </>
            {/* RHS */}
            <>
                {communityStateValue.currentCommunity &&
                    <About communityData={communityStateValue.currentCommunity} />} 
            </>
        </PageContent>

    )
}
export default SubmitPostPage;