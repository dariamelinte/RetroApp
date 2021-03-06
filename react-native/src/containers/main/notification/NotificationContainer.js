import React, { Component } from 'react'
import {
  getUserNotifications,
  readUserNotification,
  readAllUserNotifications,
} from '../../../api'
import { NotificationComponent } from '.'
import { Notification, Loading } from '../../../components'
import { ScreenEnum, BottomStackScreensEnum } from '../../../lib/enums'

const TIMEOUT = 60000

class NotificationContainer extends Component {
  constructor(props) {
    super(props)

    this.state = {
      notifications: [],
      loading: true,
    }
  }

  componentDidMount() {
    this.getNotifications()
    this.setInterval()
  }

  componentWillUnmount() {
    this.clearInterval()
  }

  setInterval = () => {
    this.notification = setInterval(this.getNotifications, TIMEOUT)
  }

  clearInterval = () => {
    clearInterval(this.setInterval)
  }

  markAllAsRead = async () => {
    const { isOk, data } = await readAllUserNotifications()

    if (!isOk) {
      return Notification.error('Something went wrong')
    }

    const { notifications } = this.state

    const newNotifications = notifications.map(n => ({
      ...n,
      isViewed: true,
    }))

    this.setState({
      notifications: newNotifications,
    })
  }

  showNotification = async (notificationId, eventId) => {
    const { isOk, data } = await readUserNotification(notificationId)

    if (!isOk) {
      return Notification.error('Something went wrong')
    }

    const { notifications } = this.state

    this.setState({
      notifications: notifications.map(n => {
        if (n._id === notificationId) {
          return {
            ...n,
            isViewed: true,
          }
        }

        return n
      }),
    })

    this.props.navigation.navigate(ScreenEnum.EVENT, {
      eventId,
    })
  }

  getNotifications = async () => {
    const { data, isOk } = await getUserNotifications()
    if (!isOk) {
      this.setState({
        loading: false,
      })
      return Notification.error('Something went wrong')
    }
    const userNotifications = data.getUserNotifications || []

    const notifications = userNotifications.map(notification => ({
      _id: notification._id,
      message: notification.data.message,
      imageSource: notification.event.photo ? notification.event.photo.fullPath : '',
      eventId: notification.event._id,
      isViewed: notification.isViewed,
    }))
    this.setState({
      loading: false,
      notifications,
    })
  }

  onSearchEvents = () => this.props.navigation.navigate(BottomStackScreensEnum.SEARCH)

  render() {
    const { notifications, loading } = this.state
    if (loading) {
      return <Loading show={loading} />
    }

    return (
      <NotificationComponent
        notifications={notifications}
        showNotification={this.showNotification}
        onSearchEvents={this.onSearchEvents}
        markAllAsRead={this.markAllAsRead}
      />
    )
  }
}

export default NotificationContainer
