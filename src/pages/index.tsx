import Head from 'next/head'
import Image from 'next/image'
import PageContent from '../components/Layout/PageContent'
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore } from '../firebase/clientApp';
import { useEffect, useState } from 'react';
import { collection, getDocs, limit, orderBy, query, where } from 'firebase/firestore';
import usePosts from '../hooks/usePosts';
import { Post, PostVote } from '../atoms/postsAtom';
import PostLoader from '../components/Posts/PostLoader';
import { Stack } from '@chakra-ui/react';
import PostItem from '../components/Posts/PostItem';
import CreatePostLink from '../components/Community/CreatePostLink';
import { CommunityState } from '../atoms/communitiesAtom';
import { useRecoilValue } from 'recoil';
import useCommunityData from '../hooks/useCommunityData';
import Reccomendations from '../components/Community/Reccomendations';
import PersonalHome from '../components/Community/PersonalHome';

export default function Home() {
  const [user, loadingUser] = useAuthState(auth);
  const [loading,setLoading] = useState(false);

  const {postStateValue,setPostStateValue,onSelectPost,onDeletePost,onVote } = usePosts();
  // const communityStateValue = useRecoilValue(CommunityState);
  const {communityStateValue } = useCommunityData();

  const buildUserHomeFeed = async () => {
    if(communityStateValue.mySnippets.length ){

      const myCommunityIds = communityStateValue.mySnippets.map((snippet) => snippet.communityId);

      const postQuery = query(collection(firestore, "posts"),
      where("communityId", "in" , myCommunityIds),
      limit(10)
      );

      const postDocs = await getDocs(postQuery);
      const posts = postDocs.docs.map(doc => ({
        id: doc.id, ...doc.data()
      }));

      setPostStateValue(prev => ({
        ...prev,
        posts: posts as Post[],
      }));

    }
    else{
      buildNoUserHomeFeed();
    }

    try {
      
    } catch (error) {
      console.log("BuildUserHOmeFeed " , error)
    }
    
  };
  
  
  
  const buildNoUserHomeFeed = async () => {
    
    setLoading(true);
  
    try {
      
      const postQuery = query(collection(firestore,"posts" ), 
      orderBy("voteStatus", "desc"), limit(10));
  
      const postDocs = await getDocs(postQuery);
      const posts = postDocs.docs.map((doc) => ({
        id: doc.id, ...doc.data()
      }));
  
      // setPostState
  
      setPostStateValue(prev => ({
        ...prev,
        posts: posts as Post[],
      }))
  
  
    } catch (error) {
      console.log("BuildNoUserhomefeed error ", error)
    }

    setLoading(false);


  };


  const getUserPostVotes = async () => {

    try {
      

      const postIds = postStateValue.posts.map(post => post.id);

      const postVotesQuery = query(collection(firestore, `users/${user?.uid}/postVotes`),
      where("postId", "in" , postIds));

      const postVoteDocs = await getDocs(postVotesQuery);
      const postVotes = postVoteDocs.docs.map((doc) => ({
        id: doc.id, ...doc.data(),
      }));

      setPostStateValue(prev => ({
        ...prev, 
        postVotes: postVotes as PostVote[],
      }))

    } catch (error) {
      console.log("getUserPostVotes ", error);
    }

  };



  // USEEFFECTs

  useEffect(() => {

    if(!user && !loadingUser)  buildNoUserHomeFeed();

  }, [user, loadingUser])


  useEffect(() => {
    // SEE IF IT HAS BEEN FETCHED
    if(communityStateValue.snippetsFetched) buildUserHomeFeed();
  }, [communityStateValue.snippetsFetched ] )


  useEffect(()=> {
    if(user && postStateValue.posts.length){
      getUserPostVotes();
    }

    // RETURN IN USEEFFECT WORKS WHEN USEEFFECT DISMOUNTS
    return () => {
      setPostStateValue((prev) => ({
        ...prev, 
        postVotes: [],
      }))
    }

  }, [user,postStateValue.posts])


  return (
    <PageContent >
      <>
        <CreatePostLink />
        {loading? (
          <PostLoader />

        ) : (
          <Stack>
            {postStateValue.posts.map(post => (
              <PostItem key={post.id} post={post} onSelectPost={onSelectPost} onDeletePost={onDeletePost} onVote={onVote} userVoteValue={postStateValue.postVotes.find(item => item.postId === post.id )?.voteValue} userIsCreator={user?.uid === post.creatorId} homePage />
            ))}
          </Stack>
        )}
      </>

      <Stack>
        <Reccomendations />

        {/* ADD FUNCTIONALITY HERE */}
        <PersonalHome />
      </Stack>

    </PageContent>
  )
}
