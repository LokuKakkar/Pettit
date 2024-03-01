import { doc, getDoc } from 'firebase/firestore';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import React, { useEffect } from 'react';
import { firestore } from '../../../firebase/clientApp';
import { Community, CommunityState } from '../../../atoms/communitiesAtom';
import safeJsonStringify from "safe-json-stringify"
import NotFound from '../../../components/Community/NotFound';
import Header from '../../../components/Community/Header';
import PageContent from '../../../components/Layout/PageContent';
import CreatePostLink from '../../../components/Community/CreatePostLink';
import Posts from '../../../components/Posts/Posts';
import { useRecoilState, useSetRecoilState } from 'recoil';
import About from '../../../components/Community/About';

type CommunityPageProps = {
    communityData: Community;
};

const CommunityPage:React.FC<CommunityPageProps> = ({communityData}) => {
    const setCommunityStateValue=useSetRecoilState(CommunityState);
    
    
    useEffect(()=> {
        setCommunityStateValue((prev) => ({
            ...prev,
            currentCommunity: communityData,
        }))
    }, [communityData ])
    
    if(!communityData){
        return(
            <NotFound />
        )
    }


    return (
        <>
            <Header communityData={communityData} />
            <PageContent>
                <>
                    <CreatePostLink />
                    <Posts communityData={communityData} />

                </>
                <> 
                    <About communityData={communityData} />
                </>
            </PageContent>

        </>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext){

    // Get community data and pass it to client
    try{
        const communityDocRef = doc(firestore, 'communities', context.query.communityId as string);

        const communityDoc = await getDoc(communityDocRef);
        return {
            props:{
                communityData: communityDoc.exists()?  JSON.parse(safeJsonStringify({id: communityDoc.id, ...communityDoc.data()})) :
                "",
            },
        };

    } catch(error){
        // COULD ADD ERROR PAGE HERE
        console.log("GetServerSideProps error", error);
    }


}

export default CommunityPage;