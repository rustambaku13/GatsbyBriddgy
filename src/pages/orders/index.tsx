import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  SimpleGrid,
  Text,
  VStack,
} from "@chakra-ui/react"
import { graphql,withPrefix } from "gatsby"
import { navigate } from "gatsby-plugin-intl"
import React, { useEffect, useRef, useState } from "react"
import { Helmet } from "react-helmet"
import { FormProvider, useForm } from "react-hook-form"
import { getOrders } from "../../api/order"
import { PublicMediumOrderCard } from "../../components/Cards/Order/MediumOrderCards"
import { TestimonialLinkCard } from "../../components/Cards/Testimonial/TestimonialLinkCard"
import Footer from "../../components/Footer"
import { LocationAutoComplete } from "../../components/Inputs/LocationAutoComplete"
import { HowToEarnMoney } from "../../components/Layout/HowToEarnMoney"
import { Empty } from "../../components/Misc/Empty"
import { Loader } from "../../components/Misc/Loader"
import NavbarDefault from "../../components/Navbar"
import { BottomNavbar } from "../../components/Navbar/BottomNavbar"
import { ChevronDownIcon } from "../../icons/ChevronDown"
import RotateIcon from "../../icons/Rotate"
import { NavigationContext } from "../../providers/navPage"
import { defaultOrders, Order, Orders } from "../../types/orders"
import { filterObject, swapItinerary } from "../../utils/misc"
import OrderPage from "../../dynamic/Order"
import { Router,Location } from "@reach/router"
import { DynamicRouter } from "../../components/DynamicRouter"

const MainOrdersPage = ({ data, location }) => {
  const methods = useForm()
  const { register, handleSubmit, setValue, getValues } = methods
  const [results, setResults]: [Orders, any] = useState(defaultOrders)
  const [loading, setLoading] = useState(true)
  const page = useRef(1)

  const getUrlParams = () => {
    const a = new URLSearchParams(location.search)
    const b = {}
    for (const [key, value] of a.entries()) {
      if (!value) continue
      setValue(key, value)
      b[key] = value
    }
    return b
  }
  console.log(location.search);
  
  const updateFilters = () => {
    // Function to refetch new page based on current form value
    setLoading(true)
    const b = getUrlParams()
    getOrders(b)
      .then(({ data }) => {
        setResults(data)
      })
      .finally(() => {
        setLoading(false)
      })
  }
  const nextBatch = () => {
    page.current++
    setLoading(true)
    const b = getUrlParams()
    getOrders({ ...b, page: page.current })
      .then(({ data }) => {
        data.results.unshift(...results.results)
        setResults(data)
      })
      .finally(() => {
        setLoading(false)
      })
  }
  useEffect(updateFilters, [location.search])
  const onSubmit = data => {
    const filteredData = filterObject(data)
    const searchParams = new URLSearchParams(filteredData)
    page.current = 1
    navigate(`.?${searchParams.toString()}`)
  }

  return (
    <FormProvider {...methods}>
      <Helmet title="Briddgy | Available Orders" defer={false}>
        <meta
          name="description"
          content="List orders that are to be delivered. Briddgy postless, peer-to-peer delivery platform. Worldwide shopping with fastest and cheapest delivery. Travel with minimum costs and earn money."
        />
      </Helmet>
      <NavigationContext.Provider value={{ page: "orders" }}>
        <NavbarDefault />
        <BottomNavbar />
      </NavigationContext.Provider>

      <Container pt="40px" as="section" minW="full">
        <Box
          onSubmit={handleSubmit(onSubmit)}
          as="form"
          autoComplete="off"
          maxW="container.lg"
          mx="auto"
        >
          <Flex
            flexWrap={["wrap", "wrap", "nowrap"]}
            mb="40px"
            alignItems="center"
          >
            <Flex
              mb={5}
              w="100%"
              bg="outline.light"
              alignItems="center"
              px={3}
              borderRadius="md"
              h="60px"
            >
              <Text color="text.medium" as="label">
                From
              </Text>
              <LocationAutoComplete
                name="src"
                placeholder="City or Country"
                fontSize="md"
              />
            </Flex>
            <IconButton
              variant="link"
              mx={["auto", "auto", 5]}
              onClick={() => {
                swapItinerary(getValues(), setValue)
              }}
              mb={5}
              aria-label="Swap Button"
              icon={
                <RotateIcon
                  transform={["rotate(90deg)", "rotate(90deg)", "none"]}
                />
              }
            />
            <Flex
              mb={5}
              w="100%"
              bg="outline.light"
              alignItems="center"
              px={3}
              borderRadius="md"
              h="60px"
            >
              <Text as="label" color="text.medium">
                To
              </Text>
              <LocationAutoComplete
                name="dest"
                placeholder="City or Country"
                fontSize="md"
                parentRef={register()}
              />
            </Flex>
            <Button
              mb={5}
              ml={[0, 0, 5]}
              w={["100%", "100%", "auto"]}
              h="60px"
              type="submit"
              size="lg"
              variant="primary"
            >
              Find Trips
            </Button>
          </Flex>
        </Box>
      </Container>
      <Container minH="400px" py="40px" as="section" maxW="full" bg="gray.100">
        <Flex mx="auto" maxW="container.md" justifyContent="space-between">
          <Text color="text.medium">{results.count} ORDERS</Text>
          <Box>
            <Menu>
              <MenuButton type="button" mr={3} color="blue.400">
                Sort By <ChevronDownIcon />
              </MenuButton>
              <MenuList>
                <MenuOptionGroup
                  onChange={value => {
                    setValue("order_by", value)
                    handleSubmit(onSubmit)()
                  }}
                  type="radio"
                >
                  <MenuItemOption value="-date">Earliest Date</MenuItemOption>
                  <MenuItemOption value="-weight">Highest Weight</MenuItemOption>
                  <MenuItemOption value="-owner__rating">User Ranking</MenuItemOption>
                </MenuOptionGroup>
              </MenuList>
              <input
                type="hidden"
                name="order_by"
                ref={register({ required: false })}
              />
            </Menu>
          </Box>
        </Flex>
        {results.results.length ? (
          <VStack maxW="container.md" w="100%" mx="auto" py={9} spacing={10}>
            {results.results.map((order: Order) => (
              <PublicMediumOrderCard mx="auto" orderData={order} />
            ))}
          </VStack>
        ) : null}
        {results.results.length == 0 && !loading ? <Empty mb="50px" /> : null}
        {loading ? <Loader mx="auto" /> : null}
        {loading == false && results.next != null ? (
          <Box w="200px" mx="auto">
            <Button onClick={nextBatch} variant="outline" bg="white" w="200px">
              Load More
            </Button>
          </Box>
        ) : null}
      </Container>

      <HowToEarnMoney />
      {/* <Container my="80px" pt={8} maxW="full" as="section">
        <Heading mb={10} fontSize="hb3" fontWeight="700" textAlign="center">
          Why our shoppers love Briddgy
        </Heading>
        <SimpleGrid
          spacing={7}
          columns={[1, 2, 3]}
          mx="auto"
          className="even-right-align"
          maxW="container.xl"
        >
          <TestimonialLinkCard
            testimonial={data.testimonials.edges[1].node.frontmatter}
          />
          <TestimonialLinkCard
            testimonial={data.testimonials.edges[1].node.frontmatter}
          />
          <TestimonialLinkCard
            testimonial={data.testimonials.edges[1].node.frontmatter}
          />
        </SimpleGrid>
      </Container> */}
      <Footer />
    </FormProvider>
  )
}
export const query = graphql`
  query {
    testimonials: allMarkdownRemark(
      filter: { fields: { sourceName: { eq: "testimonial" } } }
      limit: 3
    ) {
      edges {
        node {
          frontmatter {
            title
            date
            description
            featuredimage {
              childImageSharp {
                fluid(fit: INSIDE) {
                  ...GatsbyImageSharpFluid
                }
              }
            }
            tag
            scoppe_tag
          }
        }
      }
    }
    nature_travel: file(relativePath: { eq: "nature_travel.png" }) {
      childImageSharp {
        fixed(fit: COVER) {
          ...GatsbyImageSharpFixed
        }
      }
    }
  }
`
export default MainOrdersPage
