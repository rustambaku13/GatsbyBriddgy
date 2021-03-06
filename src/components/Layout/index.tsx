import { Box } from "@chakra-ui/layout"
import { Router } from "@reach/router"
import React from "react"
import MyOrderPage from "../../dynamic/Order"
import MyTripPage from "../../dynamic/Trip"
import SpecificProfilePage from "../../dynamic/Profile"
import "../../store/UserStore"
import { AreYouSure } from "../Modals/AreYouSure"
import { CompleteProfileModal } from "../Modals/CompleteProfileModal"
import { ConfirmEmailModal } from "../Modals/ConfirmEmailModal"
import { LoginModalForm } from "../Modals/LoginModalForm"
import { MakeProposaltoOrderModal } from "../Modals/MakeProposaltoOrderModal"
import { MakeProposaltoTripModal } from "../Modals/MakeProposaltoTripModal"

export default ({ children }) => {
  return (
    <>
      <ConfirmEmailModal />
      <MakeProposaltoOrderModal />
      <MakeProposaltoTripModal />
      <CompleteProfileModal />
      <AreYouSure />
      <LoginModalForm />
      <Box></Box>
      <div id="top-progress">
        <span className="progress-bar"></span>
      </div>
      <Router>
        <MyTripPage path="/trips/:tripId" />
        <MyOrderPage path="/orders/:orderId" />
      <SpecificProfilePage path="/profile/:userId" />
        <Box default mb={["70px", "70px", 0]} w="100%" h="100%">
          {children}
        </Box>
      </Router>
      {/* <Box path="salam" mb={["70px", "70px", 0]} w="100%" h="100%">
        {children}
      </Box> */}
      {/* <BottomNavbarDefault /> */}
    </>
  )
}
