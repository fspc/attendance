import React from 'react'
import PropTypes from 'prop-types'
import { Form, Label, Button, Input } from 'semantic-ui-react'
import '/imports/ui/member/member-visit-pin.css'

const MemberEmailPhone = props => {
  const [email, setEmail] = React.useState(props.email)
  const [mobile, setMobile] = React.useState(props.mobile)

  const handleSave = (e, h) => {
    props.save({ email, mobile })
  }

  return (
    <div className="member-visit-pin">
      <h3>Check your contact details:</h3>
      <Form onSubmit={handleSave}>
        <Form.Field>
          <Input
            name="email"
            id="email"
            focus
            defaultValue={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
          />
        </Form.Field>
        <Form.Field>
          <Input
            name="mobile"
            id="mobile"
            defaultValue={mobile}
            onChange={e => setMobile(e.target.value)}
            placeholder="Mobile"
          />
        </Form.Field>
        <Button type="submit" id="save">
          Save
        </Button>
      </Form>
    </div>
  )
}

MemberEmailPhone.propTypes = {
  save: PropTypes.func.isRequired
}

export default MemberEmailPhone
