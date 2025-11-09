import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from '../../components/NavBar/navbar';

export default function Register () {
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState("");
  const [formData, setFormData] = useState({
    nama: '',
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
    alamat: '',
    no_telp: '',
  });

  const validatePasswords = (pass, confirm) => {
    if (!confirm) {
      setErrors("");
      return;
    }
    if (pass !== confirm) {
      setErrors("Passwords do not match!");
    } else {
      setErrors("");
    }
  };

  async function handleRegister(e){
    e.preventDefault();
    const res = await fetch('/api/register/member', {
      method: "post",
      body: JSON.stringify(formData),
    }); 

    const data = await res.json();

    if(data.errors){
      setErrors(data.errors);
      return;
    }else{
      localStorage.setItem('token', data.token);
      navigate('/login');
      console.log(data);
       alert("Register success!");
    }


   
  };

  return (
    <div className="login-page">
      <div className="logo-side">
        <img src="signlogin/logo-montserrat.png" alt="logo" />
      </div>
      <div className="login-card">
        <h3 className="login-title">Create Your Account</h3>

        <form onSubmit={handleRegister}>
          <label>Nama</label>
          <input type="text" placeholder="Nama" required
          value={formData.nama} onChange={(e)=>setFormData({...formData, nama: e.target.value})}/>
           {errors.nama && <p className="error">{errors.nama[0]}</p>}


          <label>Username</label>
          <input type="text" placeholder="Username" required
          value={formData.username} onChange={(e)=>setFormData({...formData, username: e.target.value})} />
          {errors.username && <p className="error">{errors.username[0]}</p>}

          <label>Email</label>
          <input type="email" placeholder="Email" required
          value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value})}/>

          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            required
            value={formData.password} onChange={(e)=>setFormData({...formData, password: e.target.value})}
          />
          {errors.password && <p className="error">{errors.password[0]}</p>}

          <label>Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm Password"
            required
            value={formData.password_confirmation} onChange={(e)=>setFormData({...formData, password_confirmation: e.target.value})}
          />
          {errors.password && <p className="error">{errors.password[0]}</p>}

          {errors && (
            <p style={{ color: "red", fontSize: "14px", marginTop: "-5px" }}>
              {errors}
            </p>
          )}

          <label>Alamat</label>
          <input type="text" placeholder="Alamat" required
          value={formData.alamat} onChange={(e)=>setFormData({...formData, alamat: e.target.value})}/>
          {errors.alamat && <p className="error">{errors.alamat[0]}</p>}

          <label>No. Telepon</label>
          <input type="text" placeholder="08xxxxxxxxxx" required
          value={formData.no_telepon} onChange={(e)=>setFormData({...formData, no_telp: e.target.value})}/>
          {errors.no_telp && <p className="error">{errors.no_telp[0]}</p>}


          <button type="submit" className="btn-login" disabled={errors !== ""}>
            Register
          </button>

          <p className="register-text">
            Already have an account?{" "}
            <a href="#" onClick={() => navigate("/login")}>Login here</a>
          </p>

          <button type="button" className="btn-back" onClick={() => navigate("/")}>
            ← Back to Home
          </button>
        </form>
      </div>
    </div>
  );
};

