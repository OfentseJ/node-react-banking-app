import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    date_of_birth: "",
  });

  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/users/register",
        formData
      );
      console.log("Registered:", res.data);
      navigate("/login");
    } catch (err) {
      console.error(err);
      setErrorMsg("Registration failed. Check your input or try again.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
        <br />

        <input
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
        <br />

        <input
          name="email"
          placeholder="Email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <br />

        <input
          name="phone_number"
          placeholder="Phone Number"
          value={formData.phone_number}
          onChange={handleChange}
        />
        <br />

        <input
          name="date_of_birth"
          placeholder="DOB"
          type="date"
          value={formData.date_of_birth}
          onChange={handleChange}
          required
        />
        <br />

        <input
          name="password"
          placeholder="Password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <br />

        {errorMsg && (
          <p style={{ color: "red", marginTop: "1rem" }}>{errorMsg}</p>
        )}

        <button type="submit" style={{ marginTop: "1rem" }}>
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
