import React, { useState } from 'react';


const useSelectFile= () => {
    const [selectedFile, SetSelectedFile] = useState<string>()

    const onSelectFile = (event: React.ChangeEvent<HTMLInputElement>) =>{
        const reader = new FileReader();
        if(event.target.files?.[0] ){
            reader.readAsDataURL(event.target.files[0]);

        }

        reader.onload = (readerEvent) => {
            if(readerEvent.target?.result){
                SetSelectedFile(readerEvent.target?.result as string)
            }
        }

    }

    return {
        selectedFile, SetSelectedFile, onSelectFile
    }
}
export default useSelectFile;