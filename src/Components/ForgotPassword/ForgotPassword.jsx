import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'
import { Helmet } from 'react-helmet'
import Bubbles from '../Bubbles/Bubbles'

export default function ForgotPassword() {

  const [isLoading, setIsLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    email: Yup.string().required('email is required').matches(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Enter valid email'),
  })

  const formik = useFormik({
    initialValues: {
      "email":"",
    },
    onSubmit,
    validationSchema,
  })

  function onSubmit(){
    setIsLoading(true)
    setErrMsg("")

    axios.post('https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords', formik.values)
    .then((response)=> {
        setErrMsg(response.data.message)
        setIsLoading(false)
        navigate('/verifycode')
    }).catch((err)=> {
      setIsLoading(false)
      setErrMsg(err.response.data.statusMsg)
    })
  }

  return (
    <>
        <Helmet>
            <title>FreshCart - Forgot Password</title>
        </Helmet>

        <Bubbles />

      <div className="bg-slate-100 p-5 rounded-md">
        <h1 className='text-2xl mb-7'>Forgot Password</h1>
        
        <form onSubmit={formik.handleSubmit}>
            <div className="mb-2">
                <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email address</label>
                <input name='email' value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500" placeholder="john.doe@company.com" />
                {formik.errors.email && formik.touched.email && <p className='bg-red-400 text-white text-sm p-1 rounded-md my-1'>{formik.errors.email}</p>}
            </div> 
            {errMsg && <div className="mb-2">
            <p className='bg-red-400 text-white text-sm p-1 rounded-md my-1'>{errMsg}</p>
            </div>}
            <div className='flex'>
              <button disabled={isLoading} type="submit" className="mt-4 text-white ms-auto block bg-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800">
              {isLoading ? <i className='fa fa-spinner fa-spin mx-4'></i> : <span>Send Reset Code</span>}
            </button>
            </div>
        </form>
      </div>
    </>
  )
}
