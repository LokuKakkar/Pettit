import React, { useEffect } from 'react';
import PageContent from '../../../../components/Layout/PageContent';
import PostItem from '../../../../components/Posts/PostItem';
import usePosts from '../../../../hooks/usePosts';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../../../../firebase/clientApp';
import { useRouter } from 'next/router';
import { doc, getDoc } from 'firebase/firestore';
import { Post } from '../../../../atoms/postsAtom';
import About from '../../../../components/Community/About';
import useCommunityData from '../../../../hooks/useCommunityData';
import Comments from '../../../../components/Posts/Comments/Comments';
import { User } from 'firebase/auth';


const PostPage:React.FC= () => {
    
    const {postStateValue, setPostStateValue, onDeletePost, onVote} = usePosts();
    const [user] = useAuthState(auth);
    const router= useRouter();
    const {communityStateValue} = useCommunityData();


    const fetchPost = async(postId:string) => {

        try {
            
            const postDocRef = doc(firestore,"posts" , postId );
            const postDoc = await getDoc(postDocRef);
            setPostStateValue((prev) => ({
                ...prev,
                selectedPost: {id: postDoc.id, ...postDoc.data()} as Post, 
            }))
 
        } catch (error) {
            console.log("fetchpost error ",error);
        }

    };

    useEffect(()=> {

        const {pid} = router.query;
        if(pid && !postStateValue.selectedPost){
            fetchPost(pid as string);
        }

    }, [router.query, postStateValue.selectedPost])

    return (
        <PageContent>
            <>
                {postStateValue.selectedPost &&  <PostItem post={postStateValue.selectedPost} onVote={onVote} onDeletePost={onDeletePost}
                userVoteValue={
                    postStateValue.postVotes.find((item) => item.postId === postStateValue.selectedPost?.id)?.voteValue
                } 
                userIsCreator={user?.uid === postStateValue.selectedPost?.creatorId}
                />}

                <Comments user={user as User} selectedPost={postStateValue.selectedPost} communityId={postStateValue.selectedPost?.communityId as string}   />
            </>

            <>
                {communityStateValue.currentCommunity && (
                    <About communityData={communityStateValue.currentCommunity}  />
                    )}
            </>
        </PageContent>
    )
}
export default PostPage;