import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {useState} from 'react';
import Validation from './LoginValidation';
import axios from 'axios';

const Login = () => {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: ''
    })
    const navigate = useNavigate();

    const [errors,setErrors] = useState({});
    const handleSubmit = (event) => {
        event.preventDefault();
        const validationErrors = Validation(values);
        setErrors(validationErrors);
        if(validationErrors.name !== "" && validationErrors.email !== "" && validationErrors.password !== ""){
            // axios.post("http://localhost:8080/login", values)
            // .then(res=>{
            //     if(res.data === "Login Success"){
            //     navigate("/home");
            //     }else{
            //         alert("Login Failed");
            //     }
               
            // })
            // .catch(err=>console.log(err));
            axios.post("http://localhost:8080/login", values)
            .then(res => {
              if (res.data === "Login Success") {
                axios.get(`http://localhost:8080/user/${values.email}`)
                  .then(response => {
                    if (response.data.role === 'admin') {
                      navigate("/admin/users");
                    } else {
                      navigate("/home");
                    }
                  })
                  .catch(error => {
                    console.error(error);
                  });
              } else {
                alert("Login Failed");
              }
            })
            .catch(err => console.log(err));
        }
    }
    const handleInput = (event) => {
        setValues({...values, [event.target.name]: event.target.value})
    }
  return (
    <div className='d-flex justify-content-center align-items-center vh-100 bg-primary'>
     <div className='bg-white p-3 rounded w-25'>
        <h2 className='d-flex'>Sign In</h2>
        <form action="" onSubmit={handleSubmit}>
        <div className='mb-3'> 
                <label htmlFor="name"><strong>Name:</strong></label>
                <input onChange={handleInput} name="name" type="Name" placeholder='Enter your Name' className='form-control rounded-0'/>
                {errors.name && <span className='text-danger'>{errors.name}</span>}
            </div>
            <div className='mb-3'> 
                <label htmlFor="email"><strong>Email:</strong></label>
                <input onChange={handleInput} name="email" type="email" placeholder='Enter your email' className='form-control rounded-0'/>
                {errors.email && <span className='text-danger'>{errors.email}</span>}
            </div>
            <div className='mb-3'> 
                <label htmlFor="password"><strong>Password:</strong></label>
                <input onChange={handleInput} name="password" type="password" placeholder='Enter your password' className='form-control rounded-0'/>
                {errors.password && <span className='text-danger'>{errors.password}</span>}
            </div>
            <button type='submit' className='btn btn-success w-100 hover-light blue'>Log in</button>
            <p></p>
           <Link to="/signup" className='btn btn-default border d-flex justify-content-center align-items-center w-100'>Create Account</Link>
        </form>
     </div>
    </div>
  )
}
export default Login
