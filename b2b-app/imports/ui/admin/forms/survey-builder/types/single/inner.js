import React from 'react'
import PropTypes from 'prop-types'
import { Button } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import { useTheme } from '@material-ui/core/styles'

import Item from './item'
import Question from '../../question'
import { useAnswers, useQuestion, useSelectedPartValue } from '../../recoil/hooks'
import { singleAnswers } from '../../recoil/atoms'
import { DndDraggable, DndDroppable } from '../../context/dnd'
import { useBuilder } from '../../context'

/** Single Choice question */
const SingleInner = ({ pid }) => {
  const { all, add, update, remove } = useAnswers(pid)
  const [question, setQuestion] = useQuestion(pid)
  const theme = useTheme()
  const selectedPart = useSelectedPartValue()
  const { isMobile } = useBuilder()

  const getStyle = (style, snapshot) => {
    if (!snapshot.isDragging) return style
    return {
      ...style,
      boxShadow: theme.shadows[3],
      background: theme.palette.background.paper,
    }
  }

  const showMobileActions = isMobile && selectedPart === pid

  return (
    <div>
      <Question
        placeholder="Type your question"
        label={question}
        onLabelChange={(text) => setQuestion(text)}
      />
      <DndDroppable pid={pid} listAtom={singleAnswers(pid)} type={pid}>
        {(provided) => (
          <ul
            style={{ paddingLeft: 0 }}
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {all.map((c, i) => (
              <DndDraggable
                pid={pid}
                itemId={c.id || c._id}
                index={i}
                key={c.id || c._id}
              >
                {(provided, snapshot) => (
                  <Item
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getStyle(provided.draggableProps.style, snapshot)}
                    ref={provided.innerRef}
                    onRemove={() => remove(i)}
                    onAdd={() => add(i)}
                    disableRemove={all.length === 1}
                    onTextChange={(name) => update({ ...c, name }, i)}
                    text={c.name}
                    showMobileActions={showMobileActions}
                  />
                )}
              </DndDraggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </DndDroppable>
      {showMobileActions && (
        <Button
          variant="outlined"
          color="default"
          size="small"
          startIcon={<AddIcon />}
          onClick={() => add()}
        >
          New item
        </Button>
      )}
    </div>
  )
}

SingleInner.propTypes = {
  /** single instance part id */
  pid: PropTypes.string.isRequired,
  /** function gets called when any choice gets updated */
  onChange: PropTypes.func,
}

SingleInner.defaultProps = {
  initialList: [''],
}

export default SingleInner
