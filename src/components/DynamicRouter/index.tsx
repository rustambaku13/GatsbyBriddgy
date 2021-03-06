import React from 'react'
import { Router, Link, Location } from "@reach/router"
import { TransitionGroup, CSSTransitionGroup } from "react-transition-group"
export const DynamicRouter = props => (
    <Location>
      {({ location }) => (
        <TransitionGroup className="transition-group">
          <CSSTransitionGroup key={location.key} classNames="fade" timeout={500}>
            {/* the only difference between a router animation and
                any other animation is that you have to pass the
                location to the router so the old screen renders
                the "old location" */}
            <Router location={location} className="router">
              {props.children}
            </Router>
          </CSSTransitionGroup>
        </TransitionGroup>
      )}
    </Location>
  )