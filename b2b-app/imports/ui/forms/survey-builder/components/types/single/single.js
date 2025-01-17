import React from 'react'
import PropTypes from 'prop-types'
import debug from 'debug'

import { SingleInner } from './inner'
import { Frame } from '../../frame'
import SimpleSchema from 'simpl-schema'
import { singleAtom, singleSource } from '../../../recoil/atoms'
import { TypeRegistry } from '../type-registry'
import { Inspector } from '/imports/ui/forms/survey-builder/components/panels'
import {
  useSelectedPartValue,
  useAnswers,
} from '/imports/ui/forms/survey-builder/recoil/hooks'
import { QuestionProperty } from '/imports/ui/forms/survey-builder/components/panels/inspector/edit-property'

let log = debug('builder:single')

const schema = new SimpleSchema({
  id: String,
  prompt: String,
  answers: Array,
  'answers.$': Object,
  'answers.$.id': String,
  'answers.$.name': String,
  'answers.$.val': {
    type: String,
    optional: true,
  },
}).newContext()

const mapDataToAtom = (data) => {
  const state = {
    id: data.id,
    prompt: data.title,
    // prompt: data.prompt,
    // answers: data.answers.map(({ id, title, val }) => ({ id, name: title, val })),
    answers: data.answers.map(({ id, name, val }) => ({ id, name, val })),
  }

  schema.validate(state)
  if (!schema.isValid()) {
    log('expected', schema._schema)
    log('got', data)
    // throw new Error('Invalid mapping from data to single state')
  }

  return state
}

const Single = ({ pid, index }) => {
  const { all, add } = useAnswers(pid)
  return (
    <Frame pid={pid} index={index} onAdd={() => add(all.length - 1)}>
      <SingleInner pid={pid} />
    </Frame>
  )
}

const InspectorProperties = () => {
  const selectedPart = useSelectedPartValue()

  const relabelAnswers = (path) => {
    if (path.endsWith('name')) return 'Label'
    if (path.endsWith('val')) return 'Value'
    return 'Id'
  }
  return (
    <div>
      <Inspector.Section heading="Question">
        <QuestionProperty pid={selectedPart} />
      </Inspector.Section>
      <Inspector.Section heading="Answers">
        <Inspector.Property pid={selectedPart} path="answers" relabel={relabelAnswers} />
      </Inspector.Section>
    </div>
  )
}

Single.displayName = 'Single'

Single.propTypes = {
  /** id for this Single instance part */
  pid: PropTypes.string.isRequired,
  /** the position this question is rendered in the parts list */
  index: PropTypes.number,
}

export { Single }

TypeRegistry.register(
  'single',
  Single,
  singleSource,
  mapDataToAtom,
  singleAtom,
  InspectorProperties
)
