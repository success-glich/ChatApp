import React from 'react'
import {HStack,Avatar,Text} from "@chakra-ui/react"

const Message = ({text,url,user="other"}) => {
  return (
    <HStack alignSelf={ user==="me"?"flex-end":"flex-start"} bg="gray.100" paddingY={"2"} paddingX={user==="me"?"4":"2"} borderRadius={"base"}>
         {
             user==="other" && <Avatar src={url} />
        }
        <Text>
            {text}
        </Text>

        {
        
        user==="me" && <Avatar src={url} />
       

        }
       
    </HStack>
  )
}

export default Message