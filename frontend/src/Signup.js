import React,{ useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Validation from './SignupValidation';
import axios from 'axios';
const Signup = () => {
    const [values, setValues] = useState({
        name: '',
        email: '',
        password: ''
    })
    const [errors,setErrors] = useState({});
    const navigate=useNavigate();
    const handleSubmit = (event) => {
        event.preventDefault();
        const validationErrors = Validation(values);
        setErrors(validationErrors);
        if(validationErrors.name !== "" && validationErrors.email !== "" && validationErrors.password !== ""){
            axios.post("http://localhost:8080/signup", values)
            .then(res=>{
                navigate("/");
            })
            .catch(err=>console.log(err));
        }
            
    }
    const handleInput = (event) => {
        setValues({...values, [event.target.name]: event.target.value})
    }
  return (
    <div className='d-flex justify-content-center align-items-center vh-100 bg-primary'>
     <div className='bg-white p-3 rounded w-25'>
     <h2 className='d-flex'>Sign Up</h2>
        <form action="" onSubmit={handleSubmit}>
        <div className='mb-3'> 
                <label htmlFor="name"><strong>Name:</strong></label>
                <input name="name" type="text" placeholder='Enter your Name' onChange={handleInput} className='form-control rounded-0'/>
                {errors.name && <span className='text-danger'>{errors.name}</span>}
            </div>
            <div className='mb-3'> 
                <label htmlFor="email"><strong>Email:</strong></label>
                <input name="email" type="email" placeholder='Enter your email' onChange={handleInput} className='form-control rounded-0'/>
                {errors.email && <span className='text-danger'>{errors.email}</span>}
            </div>
            <div className='mb-3'> 
                <label htmlFor="password"><strong>Password:</strong></label>
                <input name="password" type="password" placeholder='Enter your email' onChange={handleInput} className='form-control rounded-0'/>
                {errors.password && <span className='text-danger'>{errors.password}</span>}
            </div>
            <button type='submit' className='btn btn-success w-100 hover-light blue'>Sign Up</button>
            <p></p>
           <Link to="/" className='btn btn-default border d-flex justify-content-center align-items-center w-100'>Login</Link>
        </form>
     </div>
    </div>
  )
}

export default Signup
