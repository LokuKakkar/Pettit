import { Alert, AlertDescription, AlertIcon, AlertTitle, CloseButton, Flex, Icon } from '@chakra-ui/react';
import React, { useState } from 'react';
import { BsLink45Deg, BsMic } from 'react-icons/bs';
import { IoDocumentText, IoImageOutline } from 'react-icons/io5';
import {BiPoll} from "react-icons/bi"
import TabItem from './TabItem';
import TextInputs from './PostForm/TextInputs';
import ImageUpload from './PostForm/ImageUpload';
import { Post } from '../../atoms/postsAtom';
import { User } from 'firebase/auth';
import { useRouter } from 'next/router';
import { Timestamp, addDoc, collection, serverTimestamp, updateDoc } from 'firebase/firestore';
import { firestore, storage } from '../../firebase/clientApp';
import { getDownloadURL, ref, uploadString } from 'firebase/storage';
import useSelectFile from '../../hooks/useSelectFile';

type NewPostForumProps = {
    user: User ;
    communityImageURL?: string; 
};

// MULTI TAB VARIATION
const formTabs: TabItemType[] = [
    {
        title: "Post",
        icon: IoDocumentText
    },
    {
        title: "Images & Video",
        icon: IoImageOutline
    },
    {
        title: "Link",
        icon: BsLink45Deg
    },
    {
        title: "Poll",
        icon: BiPoll
    },
    {
        title: "Talk",
        icon: BsMic
    }

];

export type TabItemType = {
    title: string;
    icon: typeof Icon.arguments
}

const NewPostForum:React.FC<NewPostForumProps> = ({user, communityImageURL}) => {
    const router = useRouter();
    const [selectedTab, setSelectedTab] = useState(formTabs[0].title)
    const [textInputs, setTextInputs] = useState ({
        title: "",
        body: "",
    })
    const {selectedFile, SetSelectedFile, onSelectFile} = useSelectFile();

    const [loading,setLoading] = useState(false);
    const [error,setError] = useState(false);

    const handleCreatePost = async () => {
        // CREAte new post object
        const {communityId} = router.query;

        const newPost: Post = {
            communityId: communityId as string,
            communityImageURL: communityImageURL || "",
            creatorId: user.uid,
            creatorDisplayName: user.email!.split("@")[0],
            title: textInputs.title,
            body: textInputs.body,
            numberOfComments: 0,
            voteStatus: 0,
            createdAt: serverTimestamp() as Timestamp,

        };

        // storew post in db
        setLoading(true);
        try {
            const postDocRef = await addDoc(collection(firestore, "posts"), newPost);
            // check if SelectedFile - 
                // store in storage => getDownload url 
                
                if(selectedFile){
                    const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
                    await uploadString(imageRef , selectedFile, "data_url");
                    const downloadURL = await getDownloadURL(imageRef);


                    // update post doc by adding imageurl
                    await updateDoc(postDocRef,{
                        imageURL: downloadURL,
                    });

            }

            // redirect user to community page
            router.back();

        } catch (error: any) {
            console.log("handleCreatePostError ", error)
            setError(true)
        }

        setLoading(false);

    };


    const onTextChange =(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
        const {
            target: {name,value},
        } = event;
        setTextInputs(prev => ({
            ...prev,
            [name]: value,
        }))
    }

    return (

        <Flex direction="column" bg="#1a1a1b" borderBottom={4} mt={2}>
            <Flex width="100%">
                {formTabs.map((item) => (
                    <>
                    <TabItem key={item.title} item={item} selected={item.title === selectedTab} setSelectedTab={setSelectedTab} />
                    </>
                ))}
            </Flex>

            <Flex p={4}>
                {selectedTab === "Post" &&
                    <TextInputs textInputs={textInputs} handleCreatePost={handleCreatePost} onChange={onTextChange} loading={loading} />
                }

                {selectedTab === "Images & Video" &&
                <ImageUpload selectedFile={selectedFile} onSelectImage={onSelectFile} setSelectedTab={setSelectedTab} setSelectedFile={SetSelectedFile}   />
                }

            </Flex> 
            {error && (
                <Alert status='error'>
                    <AlertIcon />
                    <AlertTitle mr={2}> Error Creating Post </AlertTitle>
                </Alert> 
            )}
        </Flex>

    )
}
export default NewPostForum;