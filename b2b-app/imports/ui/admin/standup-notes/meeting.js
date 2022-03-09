import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import Button from '@material-ui/core/Button'

import { makeStyles } from '@material-ui/core/styles'

import { Box, Container, Grid, Typography } from '@material-ui/core'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import config from './config'
import { ThemeProvider } from 'emotion-theming'
import theme from '@react-page/editor/lib/ui/ThemeProvider/DarkTheme'

const people = [
  { userId: 'mikkel', name: 'Mike' },
  { userId: 'pato', name: 'Pat' },
]

const useStyles = makeStyles({
  paper: {
    padding: 10,
    margin: 20,
    height: `100%`,
  },
  itemm: { padding: theme.spacing(2) },
})
const themeInstance = {
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
}
// const [value, setValue] = React.useState('Controlled')

// const handleChange = (event) => {
//   setValue(event.target.value)
// }

export default Meeting = () => {
  const classes = useStyles()

  return (
    <Box sx={{ width: '100%' }}>
      <form>
        <Grid container key="heading">
          <Grid xs={3} className={classes.itemm}>
            <Paper className={classes.paper}>Name</Paper>
          </Grid>

          <Grid xs={3} className={classes.itemm}>
            <Paper className={classes.paper}>Yesterday</Paper>
          </Grid>
          <Grid xs={3} className={classes.itemm}>
            <Paper className={classes.paper}>Today</Paper>
          </Grid>
          <Grid xs={3} className={classes.itemm}>
            <Paper className={classes.paper}>Blockers</Paper>
          </Grid>
        </Grid>
        {people.map((person, ix) => (
          <Grid container key={ix}>
            <Grid xs={3} key="1" className={classes.itemm}>
              <Paper className={classes.paper}>{person.name}</Paper>
            </Grid>
            <Grid xs={3} key="2" className={classes.itemm}>
              <Paper className={classes.paper}>
                <TextField
                  id="yesterday-notes"
                  label="Yesterday"
                  multiline
                  fullWidth
                  rows="4"
                  className={classes.textField}
                  margin="normal"
                  variant="outlined"
                />
              </Paper>
            </Grid>
            <Grid xs={3} key="3" className={classes.itemm}>
              <Paper className={classes.paper}>
                <TextField
                  id="today-notes"
                  label="Today"
                  multiline
                  fullWidth
                  rows="4"
                  className={classes.textField}
                  margin="normal"
                  variant="outlined"
                />
              </Paper>
            </Grid>
            <Grid xs={3} key="4" className={classes.itemm}>
              <Paper className={classes.paper}>
                <TextField
                  id="blocker-notes"
                  label="Blockers"
                  multiline
                  fullWidth
                  rows="4"
                  className={classes.textField}
                  margin="normal"
                  variant="outlined"
                />
              </Paper>
            </Grid>
          </Grid>
        ))}
      </form>
    </Box>
  )
}
