import React from 'react'
import { Component } from 'react'
import { Button, Container } from 'semantic-ui-react'
import UploadXL from '/imports/ui/ordering/uploadXL'

const debug = require('debug')('b2b:admin')

class AppSelection extends Component {
  constructor(props) {
    super(props)
    this.state = {
      addParts: true
    }
    document.title = `Administration`
  }

  toggleAddPart = () => {
    this.setState({ addParts: !this.state.addParts })
  }

  render() {
    return (
      <div>
        <Container style={{ textAlign: 'center' }}>
          <Button.Group style={{ width: '100%' }} vertical>
            <Button
              onClick={() => {
                this.props.history.push('/userprofiles')
              }}
              style={{
                height: '100px',
                marginTop: '20px',
                marginBottom: '20px'
              }}
              color="grey"
            >
              <h1>User Profiles</h1>
            </Button>

            <Button
              onClick={() => {
                this.props.history.push('/assessment')
              }}
              style={{
                height: '100px',
                marginTop: '20px',
                marginBottom: '20px'
              }}
              color="blue"
            >
              <h1>New Bike Assessment</h1>
            </Button>
            <Button
              onClick={() => {
                this.props.history.push('/jobs')
              }}
              style={{
                height: '100px',
                marginTop: '20px',
                marginBottom: '20px'
              }}
              color="green"
            >
              <h1>Current Jobs</h1>
            </Button>

            <Button
              onClick={() => {
                this.props.history.push('/job-history')
              }}
              style={{
                height: '100px',
                marginTop: '20px',
                marginBottom: '20px'
              }}
              color="green"
            >
              <h1>Completed Jobs</h1>
            </Button>

            <Button
              onClick={() => {
                this.props.history.push('/ordering')
              }}
              style={{
                height: '100px',
                marginTop: '20px',
                marginBottom: '20px'
              }}
              color="teal"
            >
              <h1>Part Prices</h1>
            </Button>
            <Button
              onClick={this.toggleAddPart}
              style={{
                height: '100px',
                marginTop: '20px',
                marginBottom: '20px'
              }}
              color="grey"
            >
              <h1>Add updated pricelist</h1>
            </Button>

            {this.state.addParts ? '' : <UploadXL uploadXL={this.props.uploadXL} toggleAddPart={this.toggleAddPart} />}
          </Button.Group>
        </Container>
      </div>
    )
  }
}

export default AppSelection
