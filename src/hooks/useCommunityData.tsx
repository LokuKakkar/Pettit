import React, { useEffect, useState } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { Community, CommunitySnippet, CommunityState } from '../atoms/communitiesAtom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../firebase/clientApp';
import { collection, doc, getDoc, getDocs, increment, writeBatch } from 'firebase/firestore';
import { AuthModalState } from '../atoms/authModalAtom';
import { useRouter } from 'next/router';

const useCommunityData = () => {
    
    const [user] = useAuthState(auth)

    const [communityStateValue, setCommunityStateValue] = useRecoilState(CommunityState);
    const setAuthModalState = useSetRecoilState(AuthModalState);
    const [loading,setLoading] =useState(false);
    const [error,setError] = useState("");
    const router = useRouter();

    const onJoinOrLeaveCommunity = (communityData: Community, isJoined: boolean) => {
        // is the user signed in?
        // if not open auth modal
        if(!user){
            setAuthModalState({open: true, view: "login"});
            return;
        }
        setLoading(true);

        if(isJoined){
            leaveCommunity(communityData.id);
            return;
        }

        joinCommunity(communityData);
        

    }




    const getMySnippets = async ( ) => {
        setLoading(true);
        try{
            // GET USER SNIPPETS
            const snippetDocs = await getDocs(
                collection(firestore, `users/${user?.uid}/communitySnippets` )
            );

            const snippets = snippetDocs.docs.map((doc) =>({
                ...doc.data()
            }))

            setCommunityStateValue(prev => ({
                ...prev,
                mySnippets: snippets as CommunitySnippet[],
                snippetsFetched: true
            }))
            
            // console.log(snippetDocs.docs);

        }
        catch(error){
            console.log("GetMySnippets error: ", error);
        }
        setLoading(false);
    }

    const joinCommunity = async (communityData: Community) =>{
        // Creating a new community snippet
        setLoading(true);
        try {
            const batch = writeBatch(firestore);

            const newSnippet: CommunitySnippet = {
                communityId: communityData.id,
                imageURL: communityData.imageUrl || "",
                isModerator: user?.uid === communityData.creatorId
            };

            batch.set(doc(firestore, `users/${user?.uid}/communitySnippets` , communityData.id),
            newSnippet
            )
            
            // updating no of members

            batch.update(doc(firestore, "communities", communityData.id), {
                numberOfMembers: increment(1),
            })


            await batch.commit();
            
            
            // update recoil state
            
            setCommunityStateValue(prev => ({
                ...prev,
                mySnippets: [...prev.mySnippets, newSnippet],
            }))


        } catch (error) {
            console.log("JoinCommunityError", error);
            setError(error.message);
        }
        setLoading(false);


    };

    const leaveCommunity = async (communityId: string) => {
        setLoading(true);

        // deleting the community snippet from user

        try {
            
            const batch = writeBatch(firestore);

            batch.delete(doc(firestore, `users/${user?.uid}/communitySnippets`, communityId));

            // updating the number of members

            batch.update(doc(firestore, "communities", communityId), {
                numberOfMembers: increment(-1),
            })
            
            await batch.commit();

            // update recoil state

            setCommunityStateValue(prev => ({
                ...prev,
                mySnippets: prev.mySnippets.filter(item => item.communityId !== communityId)
            }))


        } catch (error) {
            console.log("leaveCommunityError: ", error.message);
            setError(error);
        }

        setLoading(false);




    };


    const getCommunityData = async(communityId: string) => {

        try {
            
            const communityDocRef = doc(firestore, "communities", communityId);
            const communityDoc = await getDoc(communityDocRef);

            setCommunityStateValue((prev) => ({
                ...prev,
                currentCommunity: {
                    id: communityDoc.id,
                    ...communityDoc.data(),
                } as Community,
            }));


        } catch (error) {
            console.log("getCommunityData ", error);
        }

    }



    // BEST THING TO LEARN HERE IS THAT IF THERE IS NO USER, RETURN THE USEEFFECT
    useEffect(() => {
        if(!user) {
            setCommunityStateValue(prev => ({
                ...prev,
                mySnippets: [],
                snippetsFetched: false
            }))
            return;
        }
        getMySnippets();
    }, [user])

    useEffect(() => {
        const {communityId} = router.query;

        if(communityId && !communityStateValue.currentCommunity) {
            getCommunityData(communityId as string)
        }
    }, [router.query, communityStateValue.currentCommunity ])


    return {
        // DATA AND FUNCTIONS
        communityStateValue,
        onJoinOrLeaveCommunity,
        loading,

    };
};
export default useCommunityData;