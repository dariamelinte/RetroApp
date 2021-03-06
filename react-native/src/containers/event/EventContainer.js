import React, { Component } from 'react'
import { AsyncStorage, BackHandler } from 'react-native'
import { EventComponent } from '.'

import { getEvent, joinEvent, leaveEvent } from '../../api/event'
import { Notification, Loading } from '../../components'
import Constants, { NotificationTypeEnum, ScreenEnum } from '../../lib/enums'
import strings from '../../lib/stringEnums'

class EventContainer extends Component {
  state = {
    eventData: {},
    loading: true,
    userJoined: false,
    userId: null,
  }

  componentDidMount() {
    const { eventId } = this.props.navigation.state.params
    this.getUserId()
    this.getEvent(eventId)
  
    BackHandler.addEventListener('hardwareBackPress', this.onGoBack)
  }

  componentWillUnmount () {
    BackHandler.removeEventListener('hardwareBackPress', this.onGoBack)
  }

  getUserId = () => {
    AsyncStorage.getItem(Constants.USER_ID).then(userId => {
      this.setState({ userId })
    })
  }

  setUserJoined = () => {
    const {
      eventData: { users },
      userId,
    } = this.state

    if (!users || users.length === 0) {
      return this.setState({ userJoined: false, loading: false })
    }

    const userJoined = users.find(user => user._id === userId)

    if (userJoined) {
      this.setState({ userJoined: true, loading: false })
    } else {
      this.setState({ userJoined: false, loading: false })
    }
  }

  getEvent = eventId => {
    getEvent(eventId).then(({ data, isOk }) => {
      if (isOk) {
        this.setState({ eventData: data.getEvent }, this.setUserJoined)
      } else {
        this.setState({ loading: false })
        return Notification.show('Something went wrong', NotificationTypeEnum.ERROR)
      }
    })
  }

  onGoBack = () => {
    this.props.navigation.goBack()
  }

  onGoToUserPage = _id => {
    this.props.navigation.navigate(ScreenEnum.USER_PROFILE, {
      userId: _id,
      notEditable: true
    })
  }

  onPressToggleJoinButton = () => {
    const {
      userJoined,
      eventData: { _id: eventId },
    } = this.state

    if (!userJoined) {
      return this.joinEvent(eventId)
    }
    return this.leaveEvent(eventId)
  }

  joinEvent = async eventId => {
    const { data, isOk } = await joinEvent(eventId)

    if (isOk) {
      this.setState({ userJoined: true, loading: true }, () => this.getEvent(eventId))
    } else {
      Notification.error(strings.error)
    }
  }

  leaveEvent = async eventId => {
    const { data, isOk } = await leaveEvent(eventId)

    if (isOk) {
      this.setState({ userJoined: false, loading: true }, () => this.getEvent(eventId))
    } else {
      Notification.error(strings.error)
    }
  }

  render() {
    const { loading, userJoined, eventData } = this.state

    if (loading) {
      return <Loading show={loading} />
    }

    return (
      <EventComponent
        onGoBack={this.onGoBack}
        eventData={eventData}
        userJoined={userJoined}
        onGoToUserPage={this.onGoToUserPage}
        onPressToggleJoinButton={this.onPressToggleJoinButton}
      />
    )
  }
}

export default EventContainer
