import React from 'react'
import PropTypes from 'prop-types'
import { Button, Form, Header, Input } from 'semantic-ui-react'

const emailRegex = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i

const EmailMobile = props => {
  const { email = '', mobile = '' } = props.member
  const [form, setForm] = React.useState({ mobile, email })
  const [disabled, setDisabled] = React.useState(true)
  const save = () => {
    props.save(props.member._id, form)
  }

  const onChangeInput = (e, data) => {
    const newForm = form
    newForm[e.target.name] = e.target.value
    setForm(newForm)
    const emailValid = emailRegex.test(form.email)
    setDisabled(form.mobile.length < 8 || form.email.length < 6 || !emailValid)
  }
  return (
    <div>
      <Form onSubmit={save}>
        <Form.Field>
          <label htmlFor="mobile">Your mobile number:</label>
          <Input defaultValue={mobile} name="mobile" id="mobile" focus onChange={onChangeInput} />
        </Form.Field>
        <Form.Field>
          <label htmlFor="email">Your email</label>
          <Input defaultValue={email} name="email" id="emai" onChange={onChangeInput} />
        </Form.Field>
        <Button
          type="submit"
          id="update"
          disabled={disabled}
          color="green"
          size="large"
          fluid
          style={{ marginBottom: '24px' }}
        >
          Save
        </Button>
      </Form>
    </div>
  )
}

const Arrive = props => {
  const [showEdit, setShow] = React.useState(false)
  const needMore = !props.member.email || !props.member.mobile
  React.useEffect(() => {
    const needMore = !props.member.email || !props.member.mobile
    if (!needMore) {
      const timer = setTimeout(() => {
        props.history.push('/')
      }, 5000)
      return function cleanup() {
        clearTimeout(timer)
      }
    }
  }),
    []
  const toggleEdit = e => {
    setShow(!showEdit)
  }
  const but = needMore ? ", but your profile isn't complete" : ''
  return (
    <div style={{ padding: '20px 0' }}>
      <div>
        <Header as="h3">You are now signed in{but}</Header>
        {needMore && <EmailMobile {...props} />}
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          <Button onClick={() => props.history.push(`/edit/${props.member._id}`)}>Edit Your Profile</Button>
          {needMore && <Button onClick={() => props.history.push(`/`)}>Not now</Button>}
          {!needMore && (
            <Button onClick={() => props.history.push(`/`)} color="green">
              I'm done now
            </Button>
          )}
        </div>
      </div>

      {/* <Button onClick={() => props.history.push(`/`)} positive fluid id="done" size="large">
        Done
      </Button> */}
    </div>
  )
}

Arrive.propTypes = {}

export default Arrive
