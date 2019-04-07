// methods that affect both collections

import moment from 'moment'

import Members from '/imports/api/members/schema'
import Products, { Carts } from '/imports/api/products/schema'
import Sessions from '/imports/api/sessions/schema'
import log from '/imports/lib/server/log'
const debug = require('debug')('b2b:server-methods')

Meteor.methods({
  memberRenew(memberId, code) {
    try {
      Carts.remove({ _id: memberId })
      const product = Products.findOne({ active: true, code })
      delete product.createdAt
      delete product.updatedAt
      product.qty = 1
      const cart = {
        _id: memberId,
        memberId,
        userId: Meteor.userId,
        price: product.price,
        totalqty: 1,
        prodqty: { [product._id]: 1 },
        products: [product]
      }
      const id = Carts.insert(cart)
    } catch (e) {
      debug(`Error [${e.message}] in memberRenew, product code ${product.code}`)
    }
  },

  arrive(memberId, event) {
    const { duration, name, price } = event
    const timeIn = new Date()
    const timeOut = moment(timeIn)
      .add(duration, 'h')
      .toDate()

    try {
      const id = Sessions.insert({
        memberId,
        eventId: event._id,
        // purchaseId,
        timeIn,
        timeOut,
        duration,
        name,
        price
      })
      const session = Sessions.findOne(id)
      const sessionCount = Sessions.find({ memberId }).count()

      Members.update(memberId, {
        $set: {
          isHere: true,
          lastIn: timeIn,
          sessionCount
        },
        $push: { sessions: session }
      })
      debug('member arrive update', id, session, sessionCount, memberId, duration, timeOut)
    } catch (error) {
      log.error({ error })
    }
  },

  // signing out _isn't_ mandatory.
  // at end of each day every member will be automatically signed out.
  // if member does sign out early though, lets update timeOut and duration
  depart(id) {
    //
    // member may have signed in multiple times that day,
    // so lets find the LAST session of theirs from 12am TODAY
    //
    const session = Sessions.find({
      memberId: id,
      timeIn: {
        $gte: moment()
          .startOf('day')
          .toDate()
      }
    })
      .fetch()
      .pop()

    debug(`Member ${id} is departing, session:`, session)

    if (session) {
      // lets recalculate the duration of session
      try {
        let timeIn = moment(session.timeIn)
        let timeOut = moment()

        // update the anticipated duration with actual visit duration
        let duration = moment.duration(timeOut.diff(timeIn)).get('hours')
        if (duration === 0) {
          duration = 1
        }
        const m = Sessions.update(
          {
            _id: session._id
          },
          {
            $set: {
              // convert timeOut from moment instance to native date object
              timeOut: timeOut.toDate(),
              duration
            }
          }
        )
        const n = Members.update(
          {
            _id: id
            // sessions: {
            //   $elemMatch: {
            //     "_id": session._id,
            //   }
            // }
          },
          {
            $set: {
              isHere: false,
              lastIn: new Date(),
              'sessions.$.duration': duration
            }
          }
        )
        debug('m=' + m + ', n=' + n)
      } catch (error) {
        throw new Meteor.Error(error)
      }
    } else {
      Members.update(
        {
          _id: id
        },
        {
          $set: {
            isHere: false
          }
        }
      )
    }
  },

  // signing out _isn't_ mandatory. This is the one that happens automatically
  autoDepart(id) {
    // member may have signed in multiple times that day,
    // so lets find the LAST session of theirs from 12am TODAY
    const session = Sessions.find({
      memberId: id,
      timeIn: {
        $gte: moment()
          .startOf('day')
          .toDate()
      }
    })
      .fetch()
      .pop()

    // lets recalculate the duration of session
    let timeIn = moment(session.timeIn)
    let timeOut = moment()

    // update the anticipated duration with actual visit duration
    const duration = moment.duration(timeOut.diff(timeIn)).get('hours')

    Sessions.update(
      {
        _id: session._id
      },
      {
        $set: {
          // convert timeOut from moment instance to native date object
          timeOut: timeOut.toDate(),
          duration
        }
      }
    )

    Members.update(
      {
        _id: id,
        sessions: {
          $elemMatch: {
            _id: session._id
          }
        }
      },
      {
        $set: {
          isHere: false,
          lastIn: new Date(),
          'sessions.$.duration': duration
        }
      }
    )
  }
})
