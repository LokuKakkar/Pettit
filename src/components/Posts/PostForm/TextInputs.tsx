import { Button, Flex, Input, Stack, Textarea } from '@chakra-ui/react';
import React from 'react';

type TextInputsProps = {
    textInputs: {
        title: string;
        body: string;
    };
    onChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;

    handleCreatePost: () => void;
    loading: boolean;
};

const TextInputs:React.FC<TextInputsProps> = ({textInputs,onChange,handleCreatePost, loading}) => {
    
    return (
        <Stack spacing={3} width="100%" >
            <Input name='title' fontSize="10pt" borderRadius={4} placeholder="Title" onChange={onChange} value={textInputs.title}
            _placeholder={{color: "gray.400" }} _focus={{outline: "none" , bg:"#272729", border:"1px solid", borderColor: "gray.200"  }}  />
            
            <Textarea name='body' fontSize="10pt" borderRadius={4} placeholder="Text" height="100px" onChange={onChange} value={textInputs.body}
            _placeholder={{color: "gray.400" }} _focus={{outline: "none" , bg:"#272729", border:"1px solid", borderColor: "gray.200"  }}   />
            <Flex justify="flex-end"> 
                <Button height="34px" p="0px 30px" disabled={!textInputs.title} isLoading={loading} onClick={handleCreatePost} > 
                    Post 
                </Button>
            </Flex>

        </Stack>
    )
}
export default TextInputs;