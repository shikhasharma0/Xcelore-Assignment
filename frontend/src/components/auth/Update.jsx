import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Update.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingBar from "react-top-loading-bar";
import { MdOutlineAirplaneTicket } from "react-icons/md";
import { VscEye, VscEyeClosed } from "react-icons/vsc";

const UpdateProfile = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const ref = useRef(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: "", // Add id field to store user ID
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [showPass, setPassShow] = useState(false);

  useEffect(() => {
    // Fetch user data from the server and populate the form
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/user/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setFormData({
            id: data.user._id, // Store user ID
            name: data.user.name,
            phone: data.user.phone,
            email: data.user.email,
            password: "",
          });
        } else {
          toast.error("Failed to fetch user data");
        }
      } catch (error) {
        toast.error("An error occurred while fetching user data");
      }
    };
    fetchUserData();
  }, [BASE_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const isStrongPassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const validateForm = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;

    if (!formData.name) {
      toast.warn("Name is required.");
      isValid = false;
    }
    if (!formData.phone) {
      toast.warn("Mobile Number is required");
      isValid = false;
    }
    if (!formData.email) {
      toast.warn("Email is required.");
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      toast.warn("Invalid email format.");
      isValid = false;
    }
    if (!formData.password) {
      toast.warn("Password is required.");
      isValid = false;
    } else if (!isStrongPassword(formData.password)) {
      toast.warn("Invalid password format.");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    ref.current.continuousStart();
    e.preventDefault();
    const isFormValid = validateForm();
    if (isFormValid) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`http://localhost:5000/user/${formData.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        });
        const data = await response.json();
        if (data.success) {
          toast.success("Profile updated successfully");
          ref.current.complete();
          localStorage.setItem("role", data.user.role);
          if (data.user.role === "user") {
            setTimeout(() => {
              navigate("/tickets");
            }, 2000);
          } else {
            setTimeout(() => {
              navigate("/home");
            }, 2000);
          }
        } else {
          toast.error(data.message);
          ref.current.complete();
        }
      } catch (error) {
        toast.error("Profile update failed");
        ref.current.complete();
        console.error("Error during profile update:", error);
      }
    }
    ref.current.complete();
  };

  return (
    <div className="containerr">
      <LoadingBar color="#f11946" ref={ref} />
      <form className="form_containerr">
        <MdOutlineAirplaneTicket className="logo_container" />
        <div className="title_containerr">
          <p className="title">Update Your Profile</p>
        </div>
        <div className="input_containerr">
          <label className="input_labelr" htmlFor="name_field">
            Name
          </label>
          <input
            required
            placeholder="John Smith"
            title="Input title"
            name="name"
            type="text"
            className="input_fieldr"
            id="name_field"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="input_containerr">
          <label className="input_labelr" htmlFor="mobile_field">
            Mobile Number
          </label>
          <input
            required
            placeholder="+91 881029988"
            title="Input title"
            name="phone"
            type="text"
            className="input_fieldr"
            id="mobile_field"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div className="input_containerr">
          <label className="input_labelr" htmlFor="email_field">
            Email
          </label>
          <input
            required
            placeholder="Email"
            title="Input title"
            name="email"
            type="text"
            className="input_fieldr"
            id="email_field"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="input_containerr">
          <label className="input_label" htmlFor="password_field">
            Password
          </label>
          <input
            required
            placeholder="Password"
            title="Input title"
            name="password"
            type={showPass ? "text" : "password"}
            className="input_fieldr"
            id="password_field"
            value={formData.password}
            onChange={handleChange}
          />
          <div
            className="password-toggler"
            onClick={() => setPassShow(!showPass)}
          >
            {showPass ? <VscEye /> : <VscEyeClosed />}
          </div>
        </div>
        {formData.password && !isStrongPassword(formData.password) && (
          <span className="warnig_msg">
            Password must contain at least 8 characters, one uppercase letter,
            one lowercase letter, one number, and one special character.
          </span>
        )}
        <button
          title="Update"
          type="submit"
          className="sign-in_btnr"
          onClick={handleSubmit}
        >
          <span>Submit</span>
        </button>
        <div className="separatorr">
          <hr className="liner" />
          <span>Or</span>
          <hr className="liner" />
        </div>
        <button
          title="Sign In"
          type="submit"
          className="sign-in_gglr"
          onClick={() => navigate("/")}
        >
          <span>Back to Home</span>
        </button>
      </form>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default UpdateProfile;
