// constants.js
//
// This file contains constants to be used within the app

const CONSTANTS = {}

CONSTANTS.ROLES = {
  ADM: 'Admin',
  SYS: 'System',
}

// Notificaton roles adds a 'USR' role, for the current user
CONSTANTS.NOTIFY_ROLES = Object.assign({}, CONSTANTS.ROLES)
CONSTANTS.NOTIFY_ROLES.USR = 'Current user'

CONSTANTS.NOTIFICATION_METHODS = {
  APP: 'Application',
  EMAIL: 'Email',
  SMS: 'SMS',
  API: 'API',
}

CONSTANTS.DAYS_WEEK = [
  { id: 0, value: 'Su' },
  { id: 1, value: 'Mo' },
  { id: 2, value: 'Tu' },
  { id: 3, value: 'We' },
  { id: 4, value: 'Th' },
  { id: 5, value: 'Fr' },
  { id: 6, value: 'Sa' },
]

CONSTANTS.TRIGGERS = {
  create: 'Create',
  ready: 'Ready',
  open: 'Open',
  complete: 'Complete',
  cancel: 'Cancel',
  reject: 'Reject',
  reopen: 'Re-open',
  skip: 'Skip',
  skipall: 'Skip all',
}

CONSTANTS.USER_STATUS = {
  active: 'Active',
  suspended: 'Suspended',
  pending: 'Pending',
  deleted: 'Deleted',
}

CONSTANTS.DEFAULT_AVATAR = '/images/default-avatar.png'

// Use this message if no event was specified - it emails ADM, so that we get to know about it
CONSTANTS.UNKNOWN_EVENT = 'unknown-event'

// Consider to move these badges to a database collection
// We may have a badge for every event? or monthly badge?
CONSTANTS.BADGES = [
  {
    code: 'cc',
    title: 'Credit card',
    icon: '/badges/card.png',
    url: '/support',
    private: true,
  },
  {
    code: 'cup',
    title: 'You won a cup',
    icon: '/badges/cup.jpg',
  },
  {
    code: 'facebook',
    title: 'Linked facebook profile',
    icon: '/badges/facebook.jpg',
  },
  {
    code: 'flag',
    title: 'Has some flags?',
    icon: '/badges/flag.png',
  },
  {
    code: 'google',
    title: 'Linked google email',
    icon: '/badges/google.jpg',
  },
  {
    code: 'star',
    title: 'Must be very famous?',
    icon: '/badges/star.png',
  },
]

export default CONSTANTS
