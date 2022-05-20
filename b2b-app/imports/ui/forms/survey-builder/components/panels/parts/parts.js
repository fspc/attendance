import React, { createElement } from 'react'
import debug from 'debug'
import { useParts } from '/imports/ui/forms/survey-builder/recoil/hooks'
import { makeStyles } from '@material-ui/core/styles'
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked'
import CheckBoxIcon from '@material-ui/icons/CheckBox'
import PublishIcon from '@material-ui/icons/Publish'
import ImageIcon from '@material-ui/icons/Image'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import ListItemText from '@material-ui/core/ListItemText'
import Avatar from '@material-ui/core/Avatar'
import Divider from '@material-ui/core/Divider'

const log = debug('builder:parts')

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    'flex-direction': 'column',
    '& > *': {
      margin: theme.spacing(1),
    },
  },

  item: {
    padding: '1rem',
  },
  list: {
    flexGrow: 1,
    maxWidth: 752,
  },
}))

const partIcons = [
  { part: 'single', icon: RadioButtonCheckedIcon },
  { part: 'multiple', icon: CheckBoxIcon },
  { part: 'image', icon: ImageIcon },
  { part: 'upload', icon: PublishIcon },
]

const Parts = () => {
  const { addPart } = useParts()
  const classes = useStyles()
  // FIXME add onClose/Open handlers for drawer

  return (
    <div className={classes.list}>
      <List>
        {partIcons.map((item) => (
          <>
            <ListItem onClick={() => addPart(item.part)} className={classes.item}>
              <ListItemAvatar>
                <Avatar>{createElement(item.icon)}</Avatar>
              </ListItemAvatar>
              <ListItemText primary={item.part.toUpperCase()} />
            </ListItem>
            <Divider variant="inset" component="li" />
          </>
        ))}
      </List>
    </div>
  )
}

export { Parts }
