/* eslint-disable no-lone-blocks */
import React from 'react';
import { useForm } from 'react-hook-form';
// import * as yup from "yup";




{/*

considering running the below on an array of data to make the component/form extensible

function inputElement(type, name, placeholder){
  return(
  <label className="service-form-label">
  <input type={type} name={name} ref={register({required: true, message: `Please confirm the ${placeholder} `})}  className="service-form-input"/>
        <span className="placeholder"> {placeholder}</span>
  </label>
  )
  {errors.{name} && errors.{name} === "required" (<p>{errors.{name}.message}</p>)}
}


  const customerQuestions = SOMETHING.customer.map(inputElement(type, name, placeholder){
    return <inputEle type={type} name={name} placeholder{placeholder} key={name}/>
  })

  const bikeQuestions = SOMETHING.bike.map(inputElement(type, name, placeholder){
    return <inputEle type={type} name={name} placeholder{placeholder} key={name}/>
  })


*/}


function FormTrial() {
  const { register, handleSubmit, errors} = useForm({
    // validationSchema: schema,
    //this will autofocus to the 1st invalid  
    submitFocusError: true
    });
  const onSubmit = data => {
    console.log(data);
    let submissiondata = data
    console.log(submissiondata)
    return submissiondata
  }
  console.log(errors);
  
  // const schema = yup.object().shape(
  //   {
  //   CustomerName: yup.string().required(),
  //   phone: yup
  //     .number()
  //     .min(6)
  //     .required()
  //     .positive()
  //     .integer(),
  //   email: yup.string().email().required(),
  //   bikeBrand: yup.string().required(),
  //   bikeName: yup.string().required(),
  //   bikeColor: yup.string().required()
  // }
  // )




  // const validate = (value) => {
  //   if (!input.value) {
  //     return !valid
  //   }
  // };

  // const theform = document.getElementById("service-customer")
  return (
    <form onSubmit={handleSubmit(onSubmit)} id="service-customer">


      <section className="form-left">
      <article className="form customer-details">

      <legend>Customer Details</legend>
      <label className="service-form-label">
              <input type="text" name="CustomerName" ref={register({
                message: "Customer Name is required",
                pattern: /\W+/,
                required: true}
                )} className="service-form-input"/>

            <span className="placeholder"> Customer Name</span>

      </label>
      {errors.CustomerName && errors.CustomerName === "required" (
      <p>{errors.CustomerName.message}</p>)
      }

      <label className="service-form-label">
      <input type="email" name="email" ref={register({message: "email is required", pattern: /\W+/, required: true})}  className="service-form-input"/>
            <span className="placeholder"> email</span>
      </label>
      {errors.email &&  errors.email === "required" (
      <p>{errors.email.message}</p>)}


      <label className="service-form-label">
      <input type="text" name="phone" ref={register({message: "a phone number is required", minLength: 8, required: true})}  className="service-form-input"/>
            <span className="placeholder"> phone</span>
      </label>
      {errors.phone && errors.phone === "required" (
      <p>{errors.phone.message}</p>)}



      </article>


      <article className="form bike-details">
          <legend>Bike Details</legend>
          <label className="service-form-label">
      <input type="text" name="bikeBrand" ref={register({message: "A Brand is required", required: true})}  className="service-form-input"/>
            <span className="placeholder"> Bike Brand</span>
      </label>
      {errors.bikeBrand && <p>{errors.bikeBrand.message}</p>}
      
      <label className="service-form-label">
      <input type="text" name="bikeName" ref={register({message: "The Name is required", required: true})}  className="service-form-input"/>
            <span className="placeholder"> Bike Name</span>
      </label>
      {errors.bikeName && <p>{errors.bikeName.message}</p>}

      <label className="service-form-label">
      <input type="text" name="bikeColor" ref={register({message: "Bike Color is required", required: true})}  className="service-form-input"/>
            <span className="placeholder"> Bike Color</span>
      </label>
      {errors.bikeColor && <p>{errors.bikeColor.message}</p>}

      </article>
      </section>
      <section className="form-right">
      <article className="form misc-details">
          <legend>Misc checks</legend>
      <label>
          Replacement Bike?
      <input type="checkbox" placeholder="replacement" name="replacement" ref={register} />
      </label>
      <label>
          Urgent?
      <input type="checkbox" placeholder="urgent" name="urgent" ref={register} />
      </label>
      <label>
          Sentimental?
      <input type="checkbox" placeholder="sentimental" name="sentimental" ref={register} />
      </label>
      </article>
      
      <button type="submit" id="service-form-button">Submit </button>
      {/* <button onClick={theform.reset()}></button> */}
      </section>
    </form>
  );
}

export default FormTrial