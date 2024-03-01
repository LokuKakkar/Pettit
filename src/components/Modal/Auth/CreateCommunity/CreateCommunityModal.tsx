import { Box, Button, Checkbox, Divider, Flex, Icon, Input, MenuItem, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack, Text } from '@chakra-ui/react';
import { doc, getDoc, runTransaction, serverTimestamp, setDoc } from 'firebase/firestore';
// import { CheckBox } from '@mui/icons-material';
import React, {useState} from 'react';
import {BsFillEyeFill, BsFillPersonFill} from "react-icons/bs"
import {HiLockClosed} from "react-icons/hi"
import { auth, firestore,  } from '../../../../firebase/clientApp';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import useDirectory from '../../../../hooks/useDirectory';


type CreateCommunityModalProps = {
    open: boolean;
    handleClose: ()=> void
};





const CreateCommunityModal:React.FC<CreateCommunityModalProps> = ({open , handleClose}) => {
    const [user] = useAuthState(auth);
    const [charsRemaining, setCharsRemaining] = useState(21);
    const [communityName,setCommunityName] = useState("");
    const [communityType,setCommunityType] = useState("public")
    const [loading,setLoading] = useState(false);
    const router = useRouter();
    const [error,setError] = useState('');
    const {toggleMenuOpen} = useDirectory()
    
    const handleChange =(event: React.ChangeEvent<HTMLInputElement>) =>{
        // RECALCULATE NUMBER OF CHARS LEFT
        if(event.target.value.length > 21) return;
        setCommunityName(event.target.value);
        setCharsRemaining(21-event.target.value.length)
        
    }
    
    const onCommunityTypeChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
        setCommunityType(event.target.name);
    }
 
    
    const handleCreateCommunity = async () =>{
        if(error) setError("");
        // Validate Community Name
        var format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;
        if(format.test(communityName) || communityName.length<3 ){
            setError("Community names must be 3-21 Characters and can only contain letters, numbers, or underscores");
            return;
        }
    
        setLoading(true);

        try {
            
            const communityDocRef= doc(firestore , 'communities' , communityName);

            await runTransaction(firestore, async (transaction)=>{
                // Check if name already exists
                const communityDoc = await transaction.get(communityDocRef);
        
                if(communityDoc.exists()){
    
                    throw new Error(`Sorry, r/${communityName} is taken, try another.`);
                   
                }

                
                // Create Community
                transaction.set(communityDocRef, {
                    // creator id, created at, number of members, privacy type
                    creatorId: user?.uid,
                    createdAt: serverTimestamp(),
                    numberOfMembers: 1,
                    privacyType: communityType,
                });


                // create communitySnippet on user
                transaction.set(doc(firestore, `users/${user?.uid}/communitySnippets`,communityName), {
                    communityId: communityName,
                    isModerator: true,
                    
                })

            } )

            handleClose();
            toggleMenuOpen();
            router.push(`r/${communityName}`)
            
        } catch (error: any) {
            console.log(error);
            setError(error.message);
        }
        
        setLoading(false);


    }
    
    return (
        <>    
          <Modal isOpen={open} onClose={handleClose} size="lg">
            <ModalOverlay />
            <ModalContent bg="#0b1416">
              <ModalHeader display="flex" flexDirection="column" fontSize={15} padding={3} >
                Create a Community
            </ModalHeader>
            <Box pl={3} pr={3}>
                <Divider />
              <ModalCloseButton />
              <ModalBody display="flex" flexDirection="column" padding="10px 0px" mb={6}>
                <Text>
                    Name
                </Text>
                <Text fontSize={11} color="gray.500" >
                    Community Names including Capitalization cannot be changed 
                </Text>
                <Text position="relative" top="28px" left="10px" width="20px" > r/ </Text>
                <Input position="relative" value={communityName} size="sm" pl="22px" onChange={handleChange} />
                <Text fontSize="9pt" color={charsRemaining===0 ? "red" : "gray.500"} > {charsRemaining} Characters Remaining </Text>

                <Text color="red" pt={1} fontSize="9pt" > {error} </Text>

                <Box mt={4} mb={4} >
                    <Text fontWeight={600} fontSize={15} >
                        Community Type
                    </Text>
                    {/* CheckBox  - Stack is a kinf of checkbox in chakra */}
                    <Stack spacing={2}>
                        <Checkbox name="public" isChecked={communityType ==="public"} onChange={onCommunityTypeChange}>
                            <Flex align="center">
                                <Icon as={BsFillPersonFill} color="gray.500" mr={2} />
                                <Text fontSize="10pt" mr={1}>
                                Public
                                </Text>
                                <Text color="gray.500" fontSize="8pt" pt={1}  >
                                    Anyone can view, post and comment to this community
                                </Text>
                            </Flex>
                        </Checkbox>
                        <Checkbox name='private' isChecked={communityType ==="private"} onChange={onCommunityTypeChange}>
                            <Flex align="center">
                                <Icon as={HiLockClosed} color="gray.500" mr={2} />
                                <Text fontSize="10pt" mr={1}>
                                Private
                                </Text>
                                <Text color="gray.500" fontSize="8pt" pt={1}  >
                                    Only approved users can view and post
                                </Text>
                            </Flex>
                        </Checkbox>
                        <Checkbox name="restricted" isChecked={communityType ==="restricted"} onChange={onCommunityTypeChange}>
                            <Flex align="center">
                                <Icon as={BsFillEyeFill} color="gray.500" mr={2} />
                                <Text fontSize="10pt" mr={1}>
                                Restricted
                                </Text>
                                <Text color="gray.500" fontSize="8pt" pt={1}  >
                                    Anyone can view this community, but only aapproved users can post
                                </Text>
                            </Flex>
                        </Checkbox>
                    </Stack>
                </Box>



              </ModalBody>
            </Box>

        
              <ModalFooter>
                <Button height="30px" variant='outline' colorScheme='blue' mr={3} onClick={handleClose}>
                  Cancel
                </Button>
                <Button height="30px" onClick={handleCreateCommunity} isLoading={loading}  >Create Community</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      )
}
export default CreateCommunityModal;