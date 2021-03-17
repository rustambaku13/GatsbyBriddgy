import * as React from "react"
import { Icon } from "@chakra-ui/react"

export const TripIcon = props => (
  <Icon
    height="1em"
    fill="currentColor"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
  >
    <path d="M19 13a.495.495 0 01-.322-.118C18.487 12.722 14 8.894 14 5c0-2.757 2.243-5 5-5s5 2.243 5 5c0 3.894-4.487 7.722-4.678 7.882A.495.495 0 0119 13zm0-12c-2.206 0-4 1.794-4 4 0 2.868 2.997 5.896 4 6.828 1.003-.933 4-3.96 4-6.828 0-2.206-1.794-4-4-4z" />
    <path d="M19 7c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2zm0-3a1.001 1.001 0 000 2 1.001 1.001 0 000-2zM3 23a.501.501 0 01-.332-.126C2.56 22.778 0 20.485 0 18.125 0 16.402 1.346 15 3 15s3 1.402 3 3.125c0 2.36-2.56 4.653-2.668 4.749A.501.501 0 013 23zm0-7c-1.103 0-2 .953-2 2.125 0 1.463 1.356 3.021 2 3.679.644-.657 2-2.216 2-3.679C5 16.953 4.103 16 3 16z" />
    <path d="M15.914 24H3a.5.5 0 010-1h12.914c.318 0 .437-.244.466-.319s.105-.337-.13-.551l-7.172-6.52a1.492 1.492 0 01-.39-1.651A1.489 1.489 0 0110.086 13H19a.5.5 0 010 1h-8.914c-.318 0-.437.244-.466.319s-.105.337.13.551l7.172 6.52c.462.421.615 1.069.39 1.651a1.489 1.489 0 01-1.398.959zM3 19a1.001 1.001 0 010-2 1.001 1.001 0 010 2zm0-1.001s0 .001 0 0l.5.001z" />
  </Icon>
)

export default TripIcon
