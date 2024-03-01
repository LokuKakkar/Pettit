import React from 'react';
import { TabItemType } from './NewPostForum';
import { Flex, Icon, Text } from '@chakra-ui/react';

type TabItemProps = {
    item: TabItemType;
    selected: boolean;
    setSelectedTab:  (value: string) => void;
};

const TabItem:React.FC<TabItemProps> = ({item, selected, setSelectedTab}) => {
    
    return (

        <Flex align="center" justify="center" flexGrow={1} p="14px 0px" cursor="pointer"
        _hover={{bg: "#272729"}} color={selected? "blue.500" : "gray.400" } fontWeight={700}
        borderWidth={selected? "0px 1px 2px 0px"  : "0px 1px 1px 0px" }
        borderBottomColor={selected? "blue.500" : "gray.200"} borderRightColor="gray.200" 
        onClick={() => setSelectedTab(item.title) }>
            <Flex align="center" height="20px" mr={2} >
                <Icon as={item.icon} />
            </Flex>
            <Text fontSize="10pt" > {item.title} </Text>

        </Flex>
    )
}
export default TabItem;