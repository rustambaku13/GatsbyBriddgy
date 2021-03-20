import moment from "moment"
import { Trip } from "./../types/trip"
import { LoginModalForm } from "./../components/Form/LoginModalForm"
import { Orders } from "./../types/orders"
import Cookies from "js-cookie"
import { flowResult, makeAutoObservable } from "mobx"
import {
  createUser,
  getMyDetails,
  loginUser,
  verifyPhoneNumber,
} from "../api/user"
import { axios_normal } from "./../api/index"
import { User } from "./../types/user"
import {
  addOrder,
  emailSuggestedTravellers,
  getMyOrders,
  uploadFilestoOrder,
} from "../api/order"
import { Trips } from "../types/trip"
import { addTrip, emailSuggestedOrderers, getMyTrips } from "../api/trip"
import { compressAndReturn } from "../utils/compression"
import LayoutStore from "./LayoutStore"

class UserStore {
  me: null | User = null
  complete: false | boolean
  token: null | string = null
  new_order: any = null
  new_trip: any = null
  orders: Orders = { loading: true, results: [], count: 0 }
  trips: Trips = { loading: true, results: [], count: 0 }

  get isLoggedIn() {
    return this.me != null
  }
  get upcomingTrips() {
    const now = moment(new Date())

    return this.trips.results.filter((item: Trip) => moment(item.date) > now)
  }
  get passedTrips() {
    const now = moment(new Date())

    return this.trips.results.filter((item: Trip) => moment(item.date) <= now)
  }
  constructor() {
    makeAutoObservable(this)
    const token = Cookies.get("token")
    if (token) {
      flowResult(this.login_cookie(token)).then(() => {
        this.complete = true
      })
      return
    }
    this.complete = true
  }

  *fetchMyOrders(page = 1) {
    try {
      this.orders.loading = true
      const { data } = yield getMyOrders(page)
      this.orders = data
    } catch (e) {
      console.error("Failed to Fetch my orders")
    }
  }
  *fetchMyTrips(page = 1) {
    try {
      this.trips.loading = true
      const { data } = yield getMyTrips(page)
      this.trips = data
    } catch (e) {
      console.error("Failed to Fetch my trips")
    }
  }
  save_new_order(orderData) {
    this.new_order = orderData
  }
  *saveNewOrder() {
    try {
      if (this.new_order == null) throw Error("New Order is not defined")
      const { data } = yield addOrder(this.new_order)
      const formData: FormData = yield compressAndReturn(this.new_order.files)
      formData.append("order_id", data.id)
      const imageResult = yield uploadFilestoOrder(formData)
      emailSuggestedTravellers(
        this.new_order.source,
        this.new_order.destination
      ) // Can be finished async
      // Reshape some stuff
      data.destination = data.destinationDetails
      data.source = data.sourceDetails
      data.orderimage = imageResult.data.name
      this.new_order = null
      // Append if not loaded orders
      if (this.orders.loading == false) {
        this.orders.results.push(data)
        this.orders.count++
      }

      return data
    } catch (e) {}
  }
  save_new_trip(tripData) {
    this.new_trip = tripData
  }
  *saveNewTrip() {
    try {
      // Trip 1

      if (this.new_trip == null) {
        throw Error("New Trip is not defined")
      }
      const { data } = yield addTrip({
        ...this.new_trip,
        date: this.new_trip.date1,
      })
      const trip1 = data
      let trip2 = null
      // Email Suggested and refactor
      emailSuggestedOrderers(this.new_trip.source, this.new_trip.destination)
      trip1.destination = trip1.destinationDetails
      trip1.source = trip1.sourceDetails

      // Second Trip
      if (this.new_trip.date2) {
        const tmp_src = this.new_trip.source
        this.new_trip.source = this.new_trip.destination
        this.new_trip.destination = tmp_src
        const { data } = yield addTrip({
          ...this.new_trip,
          date: this.new_trip.date2,
        })
        trip2 = data
        emailSuggestedOrderers(this.new_trip.destination, this.new_trip.source)
        trip2.destination = trip1.destinationDetails
        trip2.source = trip1.sourceDetails
      }

      this.new_trip = null
      // Add to state
      if (this.trips.loading) return
      if (trip2) {
        // We have second Trip
        this.trips.results.unshift(trip1)
        this.trips.results.unshift(trip2)
        this.trips.count += 2
      } else {
        // We don't have second trip
        this.trips.results.unshift(trip1)

        this.trips.count++
      }
    } catch (e) {}
  }
  *sign_up(props: {
    first_name: string
    last_name: string
    password: string
    email: string
  }) {
    try {
      const { data } = yield createUser(props)
      yield flowResult(this.login(props.email, props.password))
      LayoutStore.toggleEmailConfirmModal()

      return data
    } catch (err) {
      throw err
    }
  }
  *logout() {
    // Set all default states, remove the token, remove AuthHeader from axios
    Cookies.remove("token")
    this.token = null
    this.me = null
    this.orders = { loading: true, results: [], count: 0 }
    this.trips = { loading: true, results: [], count: 0 }
    this.new_order = null
    this.new_trip = null
    delete axios_normal.defaults.headers["Authorization"]
  }
  *verifyPhoneNumber(code, phone) {
    try {
      const { data } = yield verifyPhoneNumber(code)
      this.me.is_number_verified = true
      this.me.phone = phone
    } catch (err) {
      throw err
    }
  }

  *login_cookie(token) {
    try {
      this.token = token
      axios_normal.defaults.headers["Authorization"] = `Token ${token}`
      const { data } = yield getMyDetails()
      this.me = data
    } catch (err) {
      this.logout()
    }
  }

  *login(username: String, password: String) {
    try {
      let { data } = yield loginUser(username, password)
      Cookies.set("token", data)
      this.token = data
      axios_normal.defaults.headers["Authorization"] = `Token ${data}`
      data = (yield getMyDetails()).data
      this.me = data
      return data
    } catch (err) {
      this.logout()
      throw err
    }
  }
}

export default new UserStore()