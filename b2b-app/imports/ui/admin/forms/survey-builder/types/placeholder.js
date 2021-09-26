import React, { useState } from 'react'
import PropTypes from 'prop-types'
import Frame from '../frame'
import dataCache from '../data-cache'
import TypeRegistry from './type-registry'
import { placeholderAtom, placeholderSource } from '../recoil/atoms'
import { usePlaceholderValue } from '../recoil/hooks'

/** Just pass thru the data since we don't know how to handle this type yet */
const mapDataToAtom = (data) => data

export const Placeholder = ({ pid, index }) => {
  const data = usePlaceholderValue(pid)
  const [details, setDetails] = useState(false)
  return (
    <Frame pid={pid} index={index}>
      The part specified is unimplemented or an invalid type.
      <pre>
        type: {data.type} <br />
        {details && JSON.stringify(data, null, 2)}
      </pre>
      <button onClick={() => setDetails(!details)}>
        Show {details ? 'less' : 'more'}
      </button>
    </Frame>
  )
}

Placeholder.propTypes = {
  /** id for this Placeholder instance part */
  pid: PropTypes.string,
  /** the position this question is rendered in the parts list */
  index: PropTypes.number,
}

TypeRegistry.register(
  'placeholder',
  Placeholder,
  placeholderSource,
  mapDataToAtom,
  placeholderAtom
)
