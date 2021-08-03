import { Meteor } from 'meteor/meteor'
import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useTracker } from 'meteor/react-meteor-data'

import Events from '/imports/api/events/schema.js'

import { showError, showSuccess } from '/imports/ui/utils/toast-alerts.js'

export const CalendarContext = React.createContext('carlendar')

export const CalendarProvider = (props) => {
  const { children } = props

  const mounted = useRef(true)
  useEffect(() => () => (mounted.current = false), [])

  const [formOpen, setFormOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [loading, setLoading] = useState(false)

  const { loadingEvents, events = [] } = useTracker(() => {
    const sub = Meteor.subscribe('all.events', {})
    return {
      loadingEvents: !sub.ready(),
      events: Events.find({}, { sort: { when: -1 } }).fetch(),
    }
  }, [])

  const selectEvent = (eventId) => {
    if (!eventId) {
      setSelectedEvent(null)
    }
    setSelectedEvent(Events.findOne({ _id: eventId }))
  }

  const storeEvent = (data, cb) => {
    setLoading(true)
    Meteor.call(data?._id ? 'update.events' : 'insert.events', data, (error, result) => {
      if (!mounted.current) {
        return
      }
      setLoading(false)
      if (error) {
        showError(error.message)
      }
      if (result?.status === 'false') {
        showError(result?.message)
      }
      if (result?.status === 'success') {
        showSuccess('Event created')
      }
      if (typeof cb === 'function') {
        cb(result)
      }
    })
  }

  return (
    <CalendarContext.Provider
      value={{
        loading,
        loadingEvents,
        events,
        formOpen,
        setFormOpen,
        selectedDate,
        setSelectedDate,
        selectedEvent,
        selectEvent,
        storeEvent,
      }}
    >
      {children}
    </CalendarContext.Provider>
  )
}

CalendarProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const CalendarConsumer = CalendarContext.Consumer
