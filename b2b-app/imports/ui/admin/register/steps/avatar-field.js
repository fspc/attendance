import React from 'react'
import { useField } from 'uniforms'
import Avatar from '@material-ui/core/Avatar'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import GridList from '@material-ui/core/GridList'
import GridListTile from '@material-ui/core/GridListTile'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    margin: '0 auto',
  },

  selectedAvatar: {
    height: 0,
    paddingTop: '56.25%', // 16:9,
    backgroundSize: 'contain',
    marginTop: theme.spacing(2),
  },

  selectedThumb: {
    border: '5px solid pink',
  },
}))

const AvatarField = (rawProps) => {
  const classes = useStyles()
  const [{ value, images, onChange }] = useField('avatar', rawProps)

  return (
    <Card className={classes.root}>
      <CardMedia
        image={`/images/avatars/${value}`}
        title={value}
        className={classes.selectedAvatar}
      />
      <CardContent>
        <GridList cols={6} cellHeight="auto">
          {images.map((img, idx) => (
            <GridListTile key={idx} onClick={() => onChange(img)}>
              <Avatar
                src={`/images/avatars/${img}`}
                alt={img}
                className={img === value ? classes.selectedThumb : ''}
              />
            </GridListTile>
          ))}
        </GridList>
      </CardContent>
    </Card>
  )
}

export default AvatarField
