import { Meteor } from 'meteor/meteor'
import React, { useEffect, useState, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useTracker } from 'meteor/react-meteor-data'

import Events from '/imports/api/events/schema.js'
import Members from '/imports/api/members/schema.js'
import Sessions from '/imports/api/sessions/schema.js'
import Courses from '/imports/api/courses/schema.js'

export const MySessionsContext = React.createContext('my-sessions')

export const MySessionsProvider = (props) => {
  const { children } = props

  const mounted = useRef(true)
  useEffect(() => () => (mounted.current = false), [])

  const eventIds = useRef([])
  const coachIds = useRef([])
  const courseIds = useRef([])

  const [recentSessionsWData, setRecentSessionsWData] = useState([])
  const [upcomingSessionsWData, setUpcomingSessionsWData] = useState([])

  const getCoachByCoachId = (coachId) => {
    return Members.findOne({ _id: coachId })
  }

  const getCourseByCourseId = (courseId) => {
    return Courses.findOne({ _id: courseId })
  }

  const getEventById = (eventId) => {
    const event = Events.findOne({ _id: eventId })
    if (event) {
      event.coach = getCoachByCoachId(event.coachId)
      event.course = getCourseByCourseId(event.courseId)
      event.backupCourse = getCourseByCourseId(event.backupCourseId)
    }
    return event
  }

  const { loadingRecentSessions, recentSessions } = useTracker(() => {
    const sub = Meteor.subscribe('sessions.myRecent')
    return {
      loadingRecentSessions: !sub.ready(),
      recentSessions: Sessions.find({ bookedDate: { $lt: new Date() } }).fetch(),
    }
  }, [])

  const { loadingUpcomingSessions, upcomingSessions } = useTracker(() => {
    const sub = Meteor.subscribe('sessions.myUpcoming')
    return {
      loadingUpcomingSessions: !sub.ready(),
      upcomingSessions: Sessions.find({ bookedDate: { $gt: new Date() } }).fetch(),
    }
  }, [])

  useEffect(() => {
    const newEventIds = []
    recentSessions.map((item) => {
      newEventIds.push(item.eventId)
    })
    upcomingSessions.map((item) => {
      newEventIds.push(item.eventId)
    })
    eventIds.current = newEventIds
  }, [recentSessions, upcomingSessions])

  const { loadingEvents = false, events = [] } = useTracker(() => {
    if (!eventIds.current.length) {
      return { loadingEvents: false }
    }
    const sub = Meteor.subscribe('events.byIds', eventIds.current)
    return {
      loadingEvents: !sub.ready(),
      events: Events.find({}).fetch(),
    }
  }, [eventIds.current])

  useEffect(() => {
    const newCoachIds = []
    const newCourseIds = []
    events.map((item) => {
      newCoachIds.push(item.coachId)
      newCourseIds.push(item.courseId)
      if (item.backupCourseId) {
        newCourseIds.push(item.backupCourseId)
      }
    })
    coachIds.current = newCoachIds
    courseIds.current = newCourseIds
  }, [events])

  const { loading: loadingCoaches, coaches } = useTracker(() => {
    if (!coachIds.current.length) {
      return { loading: false }
    }
    // console.log('subscribe members.byIds', coachIds.current)
    const sub = Meteor.subscribe('members.byIds', coachIds.current)
    return {
      loading: !sub.ready(),
      coaches: Members.find({ _id: { $in: coachIds.current } }).fetch(),
    }
  }, [coachIds.current])

  const { loading: loadingCourses, courses } = useTracker(() => {
    const sub = Meteor.subscribe('courses.byIds', courseIds.current)
    return {
      loading: !sub.ready(),
      courses: Courses.find({ _id: { $in: courseIds.current } }).fetch(),
    }
  }, [courseIds.current])

  const buildSessionsData = useCallback(() => {
    setRecentSessionsWData(
      recentSessions?.map((item) => {
        const event = getEventById(item.eventId)
        return {
          ...item,
          event,
        }
      })
    )
    setUpcomingSessionsWData(
      upcomingSessions?.map((item) => {
        const event = getEventById(item.eventId)
        return {
          ...item,
          event,
        }
      })
    )
  }, [events])

  useEffect(() => {
    buildSessionsData()
  }, [recentSessions, upcomingSessions, events, courses, coaches])

  return (
    <MySessionsContext.Provider
      value={{
        loadingEvents,
        loadingCoaches,
        loadingCourses,
        loadingRecentSessions,
        loadingUpcomingSessions,
        recentSessionsWData,
        upcomingSessionsWData,
        getEventById,
        getCoachByCoachId,
        getCourseByCourseId,
      }}
    >
      {children}
    </MySessionsContext.Provider>
  )
}

MySessionsProvider.propTypes = {
  children: PropTypes.node.isRequired,
}

export const MySessionsConsumer = MySessionsContext.Consumer
