import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  HStack,
  Image,
  Link,
  Text,
} from "@chakra-ui/react"
import { chakra } from "@chakra-ui/system"
import React from "react"
import { bmify } from "../../../api"
import { Contract } from "../../../types/contract"
import { ChatIcon } from "../../../icons/Chat"
import { Order } from "../../../types/orders"
import { Trip } from "../../../types/trip"
import { ContractSteps } from "../../Misc/ContractSteps"

export const TripContractsStateCard = chakra(
  ({ className, contract }: { className?: any; contract: Contract }) => {
    return (
      <Box
        px={3}
        my={8}
        py={5}
        cursor="pointer"
        transition="0.3s ease"
        _hover={{ bg: "blueAlpha.100" }}
      >
        <Heading fontSize="lg" mb={5}>
          {contract.order.title}
        </Heading>
        <Flex h="85px">
          <Center mr={5} p={3} bg="gray.100" h="85px" w="85px">
            <Image
              maxW="100%"
              maxH="100%"
              w="75px"
              src={bmify(contract.order.orderimage?.[0])}
            />
          </Center>
          <Flex
            alignItems="center"
            justifyContent="space-between"
            flex={1}
            h="100%"
          >
            <Box>
              <Link
                d="block"
                href={contract.order.order_url}
                mb={3}
                color="blue.400"
              >
                {contract.order.host}
              </Link>
              <Text variant="secondary">${contract.order.item_price}</Text>
            </Box>
            <Box>
              <Text mb={3} variant="secondary">
                Reward
              </Text>
              <Text fontWeight="600" variant="secondary">
                ${contract.order.price}
              </Text>
            </Box>
            <Button size="sm" variant="primary">
              Message
            </Button>
          </Flex>
        </Flex>
        <ContractSteps w="100%" contract={contract} />
      </Box>
    )
  }
)
