import { selectorFamily } from 'recoil'
import { get as lget, set as lset } from 'lodash'
import produce from 'immer'
import { partsAtom } from '$sb/recoil/atoms'
import { findById } from '$sb/utils/list'

/** Edit a property for a question type */
export const editInspectorState = selectorFamily({
  key: 'editProperty',
  get: ({ pid, path }) => ({ get }) => {
    const parts = get(partsAtom)
    const { config } = findById(parts, pid)
    const state = get(config.atom(pid))
    return lget(state, path)
  },
  set: ({ pid, path }) => ({ get, set }, newValue) => {
    const parts = get(partsAtom)
    const { config } = findById(parts, pid)
    const state = get(config.atom(pid))
    const nextState = produce(state, (draft) => {
      lset(draft, path, newValue)
    })
    set(config.atom(pid), nextState)
  },
})
