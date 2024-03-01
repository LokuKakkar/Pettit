import { Button, Flex, Input, Text } from '@chakra-ui/react';
import React, { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { AuthModalState } from '../../../atoms/authModalAtom';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '../../../firebase/clientApp';
import { FIREBASE_ERRORS } from '../../../firebase/errors';

type LoginProps = {
    
};

const Login:React.FC<LoginProps> = () => {
    const [loginForm, setLoginForm] = useState({
        email: "",
        password: "",
    })

    const setAuthModalState = useSetRecoilState(AuthModalState);

    const [
        signInWithEmailAndPassword,
        user,
        loading,
        error,
      ] = useSignInWithEmailAndPassword(auth);


    const onSubmit= (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        signInWithEmailAndPassword(loginForm.email, loginForm.password);

    };
    const onChange = (event: React.ChangeEvent<HTMLInputElement> ) =>{

        setLoginForm((prev) => ({
            ...prev,
            [event.target.name]: event.target.value,
         }));

    };


    return (
        <form onSubmit={onSubmit}>
            <Input required name='email' placeholder='email' type='email' mb={2} onChange={onChange}
            fontSize="10pt" _placeholder={{color: "gray.500"}} _hover={{ border: "1px solid", borderColor:"blue.500", bg: "#1a282d" }}
            _focus={{ outline: "none", border: "1px solid" , borderColor: "blue.500"}} />
            <Input required name='password' placeholder='password' type='password' mb={2} onChange={onChange}
            fontSize="10pt" _placeholder={{color: "gray.500"}} _hover={{ border: "1px solid", borderColor:"blue.500", bg: "#1a282d" }}
            _focus={{ outline: "none", border: "1px solid" , borderColor: "blue.500"}} />
            
            {error && <Text color="red" textAlign="center" fontSize="10pt" >
                {FIREBASE_ERRORS[error?.message] as keyof typeof FIREBASE_ERRORS} 
            </Text>}
            
            <Button type='submit' width="100%" height="36px" mt={2} mb={2} isLoading={loading}  >Log In </Button>

            <Flex mb={2} justifyContent="center">
                <Text fontSize="9pt" mr={1} >
                    Forgot your Password?
                </Text>
                <Text fontSize="9pt" color="blue.500" cursor="pointer" 
                onClick={()=> 
                setAuthModalState((prev) => ({
                    ...prev,
                    view: "resetPassword",
                }))} >
                    Reset
                </Text>
            </Flex>

            <Flex fontSize="9pt" justifyContent="center" >
                <Text mr={1}>New here? </Text>
                <Text color='blue.500' fontWeight={700} cursor="pointer" 
                onClick={()=> 
                setAuthModalState((prev) => ({
                    ...prev,
                    view: "signup",
                }))} >Sign Up</Text>
            </Flex>
        </form>
    )
}
export default Login;