import React, { useState } from 'react';
import { Post } from '../../atoms/postsAtom';
import { Alert, AlertIcon, AlertTitle, Flex, Icon, Image, Skeleton, Spinner, Stack, Text } from '@chakra-ui/react';
import { IoArrowDownCircleOutline, IoArrowDownCircleSharp, IoArrowRedoOutline, IoArrowUpCircleOutline, IoArrowUpCircleSharp, IoBookmarkOutline } from 'react-icons/io5';
import {AiOutlineDelete} from "react-icons/ai"
import moment from 'moment';
import { BsChat, BsDot } from 'react-icons/bs';
import { useRouter } from 'next/router';
import { FaReddit } from 'react-icons/fa';
import Link from 'next/link';
import { PiDogDuotone } from 'react-icons/pi';

type PostItemProps = {
    post: Post;
    userIsCreator: boolean;
    userVoteValue?: number;
    onVote: (event: React.MouseEvent<SVGElement,MouseEvent>, post: Post, vote: number, communityId: string) => void;
    onDeletePost: (post: Post) => Promise <boolean>;
    onSelectPost?: (post: Post) => void;
    homePage?: boolean;
};

const PostItem:React.FC<PostItemProps> = ({post,userIsCreator,userVoteValue,onVote,onDeletePost,onSelectPost,homePage}) => {
    
    const [loadingImg, setLoadingImg] = useState(true);
    const [error,setError] = useState("");
    const [loadingDelete, setLoadingDelete] = useState(false);
    const router=useRouter();
    const singlePostPage = !onSelectPost;


    const handleDelete = async (event: React.MouseEvent<HTMLDivElement,MouseEvent>) => {
        event.stopPropagation();
        setLoadingDelete(true);
    try {
        const success = await onDeletePost(post);
        if(!success) {
            throw new Error("Failed to delete post");
        }

        console.log("Post was successfully deleted");

        if(singlePostPage){
            router.push(`/r/${post.communityId}`);
        }

    } catch (error: any) {
        setError(error.message);
    }
    setLoadingDelete(false);

    }

    return (
        <Flex border="1px solid" bg="#1a1a1b" borderColor={singlePostPage? "white" : "gray.300"} borderRadius={singlePostPage? "4px 4px 0px 0px" : "4px"}
        _hover={{borderColor: singlePostPage? "none" : "gray.500" }}   >
            <Flex direction="column" align="center" bg={singlePostPage? "none" : "gray.100"} p={2} width="40px" borderRadius={!singlePostPage? "3px 0px 0px 3px" : "0px"} >
                <Icon as={userVoteValue===1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline} color={userVoteValue ===1 ? "brand.100": "gray.400"}
                fontSize={22} onClick={(event)=> onVote(event, post,1,post.communityId)} cursor="pointer" />
                <Text fontSize="10px" color={singlePostPage ? "white" : "black"} fontWeight={400} > {post.voteStatus} </Text>
                <Icon as={userVoteValue=== -1 ? IoArrowDownCircleSharp : IoArrowDownCircleOutline} color={userVoteValue=== -1 ? "#4379ff" : "gray.400"} fontSize={22} onClick={(event)=> onVote(event,post,-1,post.communityId)} cursor="pointer" />

            </Flex>

            <Flex direction="column" width="100%" onClick={()=> onSelectPost && onSelectPost(post)} cursor={singlePostPage ? "unset" : "pointer"}  >
            {error && (
                <Alert status='error'>
                    <AlertIcon />
                    <AlertTitle mr={2}> Error Deleting Post </AlertTitle>
                </Alert> 
            )}
                <Stack spacing={1} p="10px">
                    <Stack direction="row" spacing={0.6} align="center" fontSize="9pt" >
                        {/* HOME PAGE CHECK */}

                        {homePage && (
                            <>
                                {post.communityImageURL ? (
                                    <Image src={post.communityImageURL} borderRadius="full" boxSize="18px" mr={2}  />
                                ) : (
                                    <Icon as={PiDogDuotone} fontSize="18pt" mr={1} color="blue.500" />

                                )}
                                
                                <Link href={`r/${post.communityId}`} >
                                    <Text fontWeight={700} _hover={{ textDecoration: "underline" }} 
                                    // when we click it takes us to post page and then community page
                                    onClick={(event) => event.stopPropagation()}
                                    >
                                        {`r/${post.communityId}`}
                                    </Text>
                                </Link>

                                <Icon as={BsDot} color="gray.500" fontSize={8}  />


                            </>
                        )}

                        <Text> Posted by u/{post.creatorDisplayName}{" "}
                        {moment(new Date(post.createdAt?.seconds * 1000)).fromNow() }
                        </Text>
                    </Stack>

                    <Text fontSize="12pt" fontWeight={600} >
                        {post.title}
                    </Text>
                    <Text fontSize="10pt"  >
                        {post.body}
                    </Text>
                    {post.imageURL && (
                        <Flex justify='center' align="center" p={2} >
                            {loadingImg && (
                                <Skeleton height="200px" width="100%" borderRadius={4} />
                            )}
                            <Image src={post.imageURL} maxHeight="460px" alt='Post Image' display={loadingImg ? "none" : "unset"} onLoad={()=> setLoadingImg(false)}  />
                        </Flex>
                    )}

                </Stack>
                

                
                <Flex ml={1} mb={0.5} color="gray.500" fontWeight={600} >
                    <Flex align="center" p="8px 10px" borderRadius={4} _hover={{bg: "gray.200"}} cursor="pointer" >
                        <Icon as={BsChat} mr={2} />
                        <Text fontSize="9pt" > {post.numberOfComments} </Text>
                    </Flex>
                    <Flex align="center" p="8px 10px" borderRadius={4} _hover={{bg: "gray.200"}} cursor="pointer" >
                        <Icon as={IoArrowRedoOutline} mr={2} />
                        <Text fontSize="9pt" > Share </Text>
                    </Flex>
                    <Flex align="center" p="8px 10px" borderRadius={4} _hover={{bg: "gray.200"}} cursor="pointer" >
                        <Icon as={IoBookmarkOutline} mr={2} />
                        <Text fontSize="9pt" > Save </Text>
                    </Flex>


                    {userIsCreator &&
                    (
                        <Flex align="center" p="8px 10px" borderRadius={4} _hover={{bg: "gray.200"}} cursor="pointer" onClick={handleDelete} >
                            {loadingDelete? (
                                <Spinner size="sm" />
                                ) :
                                <>
                            <Icon as={AiOutlineDelete} mr={2} />
                            <Text fontSize="9pt"> Delete </Text>
                            </>
                            }
                        </Flex>

                    )}
                </Flex>

            </Flex>

        </Flex>
    )
}
export default PostItem;