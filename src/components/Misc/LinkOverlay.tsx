import { chakra } from "@chakra-ui/system"
import { Link } from "gatsby-plugin-intl"
import React from "react"

export const LinkOverlay = chakra(({className,...props}) => {
  return (
    <Link zIndex={2} className={`link-overlay ${className}`} {...props}>
      {props.children}
    </Link>
  )
})
