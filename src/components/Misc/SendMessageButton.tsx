import { Button } from "@chakra-ui/button"
import { navigate } from "gatsby-plugin-intl"
import React from "react"
import MessageStore from "../../store/MessageStore"
export const SendMessage = props => {
  const handleMessage = () => {
    // MessageStore.handleStartTopicRequest(`usr${props.user.tinode_user_id}`)
    navigate(`/messages/usr${props.user.tinode_user_id}/`)
  }

  return (
    <Button onClick={handleMessage} {...props}>
      {props.children}
    </Button>
  )
}
