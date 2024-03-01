import { Button, Flex, Input, Text } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { AuthModalState } from '../../../atoms/authModalAtom';
import PetsIcon from '@mui/icons-material/Pets';
import {useCreateUserWithEmailAndPassword} from 'react-firebase-hooks/auth'
import { auth, firestore } from '../../../firebase/clientApp';
import {FIREBASE_ERRORS} from '../../../firebase/errors'
import { User } from 'firebase/auth';
import { addDoc, collection } from 'firebase/firestore';

type SignupProps = {
    
};

const SignUp:React.FC<SignupProps> = () => {
    const setAuthModalState = useSetRecoilState(AuthModalState);
    const [signupForm, setSignupForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    })

    const [perror,setpError] = useState("");
    
    const [
        createUserWithEmailAndPassword,
        userCred,
        loading,
        userError,
    ] = useCreateUserWithEmailAndPassword(auth);
    

    const onSubmit= (event: React.FormEvent<HTMLFormElement>) => {
        // Password Match
        event.preventDefault();
        if(perror) setpError("");
        if(signupForm.password !== signupForm.confirmPassword){
            // setError
            setpError("Passwords do not Match");
            return;
        }

        createUserWithEmailAndPassword(signupForm.email, signupForm.password);
    };



    const onChange = (event: React.ChangeEvent<HTMLInputElement> ) =>{

        setSignupForm((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
         }));

    };


    const createUserDocument = async (user: User)=> {
        await addDoc(collection(firestore, 'users'), JSON.parse(JSON.stringify(user))  );
    }

    useEffect(()=> {
        if(userCred) {
            createUserDocument(userCred.user);
        }
    }, [userCred])

    return (
        <form onSubmit={onSubmit}>
            <Input required name='email' placeholder='email' type='email' mb={2} onChange={onChange}
            fontSize="10pt" _placeholder={{color: "gray.500"}} _hover={{ border: "1px solid", borderColor:"blue.500", bg: "#1a282d" }}
            _focus={{ outline: "none", border: "1px solid" , borderColor: "blue.500"}} />
            <Input required name='password' placeholder='password' type='password' mb={2} onChange={onChange}
            fontSize="10pt" _placeholder={{color: "gray.500"}} _hover={{ border: "1px solid", borderColor:"blue.500", bg: "#1a282d" }}
            _focus={{ outline: "none", border: "1px solid" , borderColor: "blue.500"}} />

            <Input required name='confirmPassword' placeholder='confirm password' type='password' mb={2} onChange={onChange}
            fontSize="10pt" _placeholder={{color: "gray.500"}} _hover={{ border: "1px solid", borderColor:"blue.500", bg: "#1a282d" }}
            _focus={{ outline: "none", border: "1px solid" , borderColor: "blue.500"}} />
            
            {(perror || userError) && 
            (<Text textAlign="center" color="red">
                { perror || FIREBASE_ERRORS[userError?.message] as keyof typeof FIREBASE_ERRORS   }
            </Text>)}

            <Button type='submit' width="100%" height="36px" mt={2} mb={2} isLoading={loading} >Sign Up </Button>

            <Flex fontSize="9pt" justifyContent="center" >
                <PetsIcon fontSize='small' /><Text mr={1}> Already a Pettitor?  </Text> 
                <Text color='blue.500' fontWeight={700} cursor="pointer" 
                onClick={()=> 
                setAuthModalState((prev) => ({
                    ...prev,
                    view: "login",
                }))} >Login</Text>
            </Flex>
        </form>
    )
}
export default SignUp;