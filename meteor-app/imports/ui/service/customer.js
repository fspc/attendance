import React, { useContext } from 'react'
import { ServiceContext } from './service-context'
import { Formik, Form, useField } from 'formik'
import * as Yup from 'yup'
import { Header, Segment, Input, Button, Checkbox } from 'semantic-ui-react'

const Client = () => {
  const [state, setState] = useContext(ServiceContext)
  const { name, email, phone, make, model, color, replacement, urgent, sentimental } = state
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Required'),
    email: Yup.string().required('Required'),
    phone: Yup.string().required('Required'),
    make: Yup.string().required('Required'),
  })

  const TextInput = ({ label, ...props }) => {
    const [field, meta] = useField(props)
    return (
      <div style={{ marginTop: '10px' }}>
        <b>{label}</b>
        <Input className="text-input" placeholder={label} {...field} {...props} fluid />
        {meta.touched && meta.error ? (
          <div className="error" style={{ color: 'red' }}>
            {meta.error}
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <Formik
      initialValues={{
        name,
        email,
        phone,
        make,
        model,
        color,
        replacement,
        urgent,
        sentimental,
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        console.log(values)
        setState({ ...state, ...values })
        state.updateAssessment(values)
        setSubmitting(false)
        // resetForm({})
      }}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <Segment>
            <Header content="Customer Details" dividing />
            <TextInput id="name-input" label="Name" name="name" />
            <TextInput id="email-input" label="Email" name="email" />
            <TextInput id="phone-input" label="Phone" name="phone" />
          </Segment>
          <Segment>
            <Header content="Bike Details" dividing />
            <TextInput id="make-input" label="Make" name="make" />
            <TextInput id="model-input" label="Model" name="model" />
            <TextInput id="colour-input" label="Colour" name="color" />
          </Segment>
          <Segment>
            <Header content="Misc" dividing />
            <Checkbox
              defaultChecked={replacement}
              label="Replacement Bike Requested"
              name="replacement"
              onChange={() => setFieldValue('replacement', !values.replacement)}
            />
            <br />
            <Checkbox label="Urgent" name="urgent" />
            <br />
            <Checkbox label="Sentimental" name="sentimental" />
          </Segment>
          <Button type="submit" id="service-form-button" content="Submit" color="blue" />
        </Form>
      )}
    </Formik>
  )
}

export default Client
