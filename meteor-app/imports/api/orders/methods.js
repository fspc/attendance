import { Meteor } from 'meteor/meteor'
import Orders from '/imports/api/orders/schema'
import log from '/imports/lib/server/log'
const debug = require('debug')('b2b:orders')

Meteor.methods({
  'orders.insert'(order) {
    try {
      return Orders.insert(order)
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  },
  'orders.remove'(id) {
    try {
      log.info('removing order: ', id)
      return Orders.remove({ _id: id })
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  },
  'orders.update'(orderedPart) {
    try {
      log.info('updating order: ', orderedPart)
      return Orders.update({ status: 1 }, { $push: { orderedParts: { ...orderedPart } } })
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }
  },
  'orders.qtyUpdate'(orderedParts){
    try {
      log.info('adding quantity to order ')
      return Orders.update({ status: 1 }, { $set: { orderedParts } })
    } catch (e) {
      log.error({ e })
      throw new Meteor.Error(500, e.sanitizedError.reason)
    }

  }


})
