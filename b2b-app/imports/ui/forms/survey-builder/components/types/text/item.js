import React, { forwardRef, useState } from 'react'
import DeleteIcon from '@material-ui/icons/Delete'
import DragIndicatorIcon from '@material-ui/icons/DragIndicator'
import DragHandleIcon from '@material-ui/icons/DragHandle'
import AddIcon from '@material-ui/icons/Add'
import { IconButton, Hidden } from '@material-ui/core'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import debug from 'debug'
import { InlineEdit } from '/imports/ui/forms/survey-builder/components/core/inline-edit'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import { makeStyles } from '@material-ui/core/styles'

const log = debug('builder:item')

const subType = [
  { label: 'Short', value: 'text' },
  { label: 'Long', value: 'long' },
  { label: 'Email', value: 'email' },
  { label: 'Number', value: 'number' },
  { label: 'Date', value: 'date' },
]

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}))

export const StyledItem = styled('span')(({ theme }) => ({
  listStyleType: 'none',
  display: 'flex',
  alignItems: 'center',
  '.inline-edit': {
    marginLeft: theme.spacing(1),
    flexGrow: 1,
  },
  '.icon': {
    margin: 3,
  },
  [theme.breakpoints.up('sm')]: {
    '&:hover': { outline: `1px solid ${theme.palette.divider}` },
    '.inline-edit': {
      marginLeft: theme.spacing(2),
    },
  },
}))

export const Actions = styled('div')(({ theme, showMobileActions }) => {
  /**
   * Visually hide an element, but leave it available for screen readers
   * @link https://github.com/h5bp/html5-boilerplate/blob/master/dist/css/main.css
   * @link http://snook.ca/archives/html_and_css/hiding-content-for-accessibility
   */
  const hideVisually = {
    border: '0',
    clip: 'rect(0 0 0 0)',
    height: '1px',
    margin: '-1px',
    overflow: 'hidden',
    padding: '0',
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: '1px',
  }

  /**
   * Extends the .screen-reader class to allow the element to be focusable when navigated to via the keyboard
   * @link https://github.com/h5bp/html5-boilerplate/blob/master/dist/css/main.css
   * @link https://www.drupal.org/node/897638
   */
  const showVisually = {
    clip: 'auto',
    height: 'auto',
    overflow: 'visible',
    position: 'static',
    whiteSpace: 'normal',
    width: 'auto',
    flexShrink: 0,
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(2),
    },
  }
  if (showMobileActions) {
    return showVisually
  }

  /** show on mouse hover and when tabbing. Note: you must import styled from 'styled-components'
   * and not from '@material-ui/core/styles' when referencing components.
   * https://styled-components.com/docs/advanced#referring-to-other-components */
  return {
    ...hideVisually,
    [`${StyledItem}:hover &, &:focus-within`]: showVisually,
    '& svg': {
      verticalAlign: 'middle',
      fill: theme.palette.action.active,
    },
    '.delete-button[disabled] svg': {
      fill: theme.palette.action.disabled,
    },
  }
})

/** A radio button with actions to move it up/down and delete. Used by Single component */
const Item = forwardRef(
  (
    {
      text,
      type,

      onTextChange,
      onRemove,
      onAdd,
      disableRemove,
      showMobileActions,
      pid,
      index,
      onChange,
      ...otherProps
    },
    ref
  ) => {
    const classes = useStyles()
    const preventFocus = (e) => {
      // Actions stay visible after user clicks a button and mouse leaves Item. The reason this
      // happens is because Actions uses the 'focus-within' rule to make it visible. This fixes it by
      // preventing focus but still allows tabbing to work correctly.
      e.preventDefault()
    }
    // const ListStyleType = showMobileActions ? DragHandleIcon : RadioButtonUncheckedIcon


    return (
      <StyledItem ref={ref} {...otherProps} >
        {showMobileActions && <DragHandleIcon className="icon" />}
        <FormControl className={classes.formControl}>
          <InputLabel id="text-sub-type">Type</InputLabel>
          <Select
            labelId="text-sub-type"
            id={`${pid}_${index}`}
            value={type}
            onChange={({target:{value}}) => {
              onChange(value)}
            }
          >
            {subType.map(({ label, value }) => (
              <MenuItem component="div" key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <InlineEdit
          className="inline-edit"
          text={text}
          placeholder={'Label for the answer'}
          onTextChange={onTextChange}
          pid={pid}
        
        />
        <Actions onMouseDown={preventFocus} showMobileActions={showMobileActions}>
          <Hidden xsDown>
            <DragIndicatorIcon />
            <IconButton size="small" onClick={onAdd} aria-label="add">
              <AddIcon />
            </IconButton>
          </Hidden>

          <IconButton
            className="delete-button"
            size="small"
            onClick={onRemove}
            aria-label="delete"
            disabled={disableRemove}
          >
            <DeleteIcon />
          </IconButton>
        </Actions>
      </StyledItem>
    )
  }
)

Item.displayName = 'Item'

Item.propTypes = {
  /** Initial text to show */
  text: PropTypes.string,
  /** Show placeholder when `text` content is empty */
  placeholder: PropTypes.string,
  /** function gets called when text field loses focus */
  onTextChange: PropTypes.func,
  /** function gets called when delete button pressed */
  onRemove: PropTypes.func,
  /** function gets called when add button pressed */
  onAdd: PropTypes.func,
  /** disable removing choice */
  disableRemove: PropTypes.bool,
  /** whether to show actions for mobile */
  showMobileActions: PropTypes.bool,
}

Item.defaultProps = {
  placeholder: 'New choice',
}

export { Item }
