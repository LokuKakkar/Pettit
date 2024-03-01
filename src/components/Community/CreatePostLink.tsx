import { Flex, Icon, Input } from "@chakra-ui/react";
// import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { BsLink45Deg } from "react-icons/bs";
import { FaReddit } from "react-icons/fa";
import { IoImageOutline } from "react-icons/io5";
import { auth } from "../../firebase/clientApp";
import { useSetRecoilState } from "recoil";
import { AuthModalState } from "../../atoms/authModalAtom";
import useDirectory from "../../hooks/useDirectory";
// import useDirectory from "../../hooks/useDirectory";


const CreatePostLink: React.FC = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(AuthModalState);
  const  {toggleMenuOpen} = useDirectory();



  const onClick = () => {
    if(!user){
        setAuthModalState({open: true, view: "login"});
        return;
    }    
    const {communityId} = router.query;

    if(communityId){
    router.push(`/r/${communityId}/submit`);
    return;
    }

    // ELSE IF NO COMMUNITY SELECTED
    toggleMenuOpen();


  };
  return (
    <Flex justify="space-evenly" align="center" bg="#1a1a1b" height="56px" 
      borderRadius={4} border="1px solid gray" p={2} mb={4}
    >
      <Icon as={FaReddit} fontSize={36} color="gray.300" mr={4} />
      <Input placeholder="Create Post" fontSize="10pt" _placeholder={{ color: "gray.500" }}
        _hover={{
          bg: "#272729", border: "1px solid", borderColor: "blue.500",
        }}
        _focus={{
          outline: "none", bg: "#272729", border: "1px solid", borderColor: "blue.500",
        }}
        bg="#0b1416" borderColor="gray" height="36px" borderRadius={4}
        mr={4} onClick={onClick}
      />
      <Icon
        as={IoImageOutline} fontSize={24} mr={4} color="gray.400"cursor="pointer"
      />
      <Icon as={BsLink45Deg} fontSize={24} color="gray.400" cursor="pointer" />
    </Flex>
  );
};
export default CreatePostLink;