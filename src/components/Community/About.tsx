import React, { useRef, useState } from 'react';
import { Community, CommunityState } from '../../atoms/communitiesAtom';
import { Box, Button, Divider, Flex, Icon, Image, Spinner, Stack, Text } from '@chakra-ui/react';
import { HiOutlineDotsHorizontal } from 'react-icons/hi';
import { RiCakeLine } from 'react-icons/ri';
import moment from 'moment';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, firestore, storage } from '../../firebase/clientApp';
import useSelectFile from '../../hooks/useSelectFile';
import { FaReddit } from 'react-icons/fa';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';
import { useSetRecoilState } from 'recoil';
import { AuthModalState } from '../../atoms/authModalAtom';

type AboutProps = {
    communityData: Community;
};

const About:React.FC<AboutProps> = ({communityData}) => {
    const [user] = useAuthState(auth)
    const selectedFileRef = useRef<HTMLInputElement>(null);
    const {selectedFile, SetSelectedFile,onSelectFile } = useSelectFile();
    const [uploadingImg, setUploadingImg] = useState(false);
    const setCommunityStateValue = useSetRecoilState(CommunityState)
    const setAuthModalState = useSetRecoilState(AuthModalState);


    const onUpdateImg = async() => {
        if(!selectedFile) return;
        setUploadingImg(true);

        try {
            const imageRef = ref(storage, `communities/${communityData.id}/image`);
            await uploadString(imageRef, selectedFile, "data_url");
            const downloadURL = await getDownloadURL(imageRef);
            await updateDoc(doc(firestore, "communities", communityData.id), {
                imageUrl: downloadURL,
            } )

            setCommunityStateValue(prev => ({
                ...prev, 
                currentCommunity: {
                    ...prev.currentCommunity,
                    imageUrl: downloadURL,
                } as Community,
            }))


        } catch (error) {
            console.log("OnuoploadError", error);
        }
        setUploadingImg(false);
    }

    return (
        <Box position="sticky" top="14px">
            <Flex justify="space-between" align="center" bg="blue.400" color="white" p={3} borderRadius="4px 4px 0px 0px"  >
                <Text fontSize="10pt" fontWeight={700}>
                    About Community
                </Text>
                <Icon as={HiOutlineDotsHorizontal} /> 
            </Flex>
            <Flex direction="column" p={3} bg="#1a1a1b" borderRadius="0px 0px 4px 4px" >
                <Stack>
                    <Flex width="100%" p={2} fontSize="10pt"  >
                        <Flex direction="column" flexGrow={1}  >
                            <Text> {communityData?.numberOfMembers? communityData?.numberOfMembers.toLocaleString() : "0"} </Text>
                            <Text> Members </Text>
                        </Flex>
                        <Flex direction="column" flexGrow={1}>
                            <Text> 1 </Text>
                            <Text> Online </Text>
                        </Flex>
                    </Flex>
                    <Divider />
                    <Flex align="center" width="100%" p={1} fontWeight={500} fontSize="10pt" >
                        <Icon as={RiCakeLine} fontSize={18} mr={2} />
                        {communityData.createdAt && (
                            <Text>
                                Created{" "}
                                {moment(new Date(communityData.createdAt.seconds * 1000)).format("MMM DD, YYYY")  }
                            </Text>
                        )}
                    </Flex>
                    
                    {user?.uid ?   
                    <Link href={`/r/${communityData.id}/submit`} >
                        <Button mt={3} height= "30px" >
                            Create Post
                        </Button>
                    </Link>
                    
                    :
                    <Button mt={3} height= "30px" onClick={()=> setAuthModalState({open: true, view: "login"})} >
                            Create Post
                    </Button>
                    
                    }


                    {user?.uid === communityData.creatorId  && (
                        <div>
                        <Divider />
                        <Stack spacing={1} fontSize="10pt" >
                            <Text fontWeight={600}> Admin </Text>
                            <Flex align="center" justify="space-between" >
                                <Text color="blue.500" cursor="pointer"
                                _hover={{textDecoration: "underline"}} onClick={() => selectedFileRef.current?.click()} >
                                    Change Image </Text>
                                
                                {communityData.imageUrl || selectedFile ? (
                                    <Image src={selectedFile || communityData.imageUrl} borderRadius="full" boxSize="40px" alt='community Image' />
                                )  : 
                                 ( 
                                    <Icon as={FaReddit} fontSize={35} color="brand.100" mr={2} />
                                 )}
                            </Flex>
                            {selectedFile && (
                                uploadingImg ? (
                                    <Spinner />
                                ) : (
                                    <Text cursor="pointer" onClick={onUpdateImg}   > Save Changes </Text>
                                )
                            )}
                            <input id="file-upload" type='file' accept='image/x-png,image/gif,image/jpeg' hidden ref={selectedFileRef} onChange={onSelectFile} />

                        </Stack>
                        </div>
                    )}
                </Stack>

            </Flex>
        </Box>
    )
}
export default About;