import { Avatar as Cavatar, chakra } from "@chakra-ui/react"
import { Link } from "gatsby-plugin-intl"
import React from "react"
import { bmify } from "../../api"
import { User } from "../../types/user"

export const Avatar = chakra(
  ({ className, user }: { className?: any; user: User }) => {
    return (
      <Link to={`/profile/${user.id}`}>
        <Cavatar
          transition=".4s border ease"
          _hover={{ borderWidth: "1px", borderColor: "blue.600" }}
          className={className}
          src={bmify(user.avatarpic)}
        />
      </Link>
    )
  }
)