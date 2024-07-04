import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./GetAllUserInfo.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoadingBar from "react-top-loading-bar";
import { MdOutlineAirplaneTicket } from "react-icons/md";
import { VscEye, VscEyeClosed } from "react-icons/vsc";
// import { useQuery } from "../../../api/query"


const GetAllUserData = () => {
  const BASE_URL = process.env.REACT_APP_BASE_URL;
  const ref = useRef(null);
  const navigate = useNavigate();
  const { id } = useParams(); // Getting the ID from the URL params

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  // const query = useQuery();
  // const [allfilterData, setAllfilterData] = useState(null);
  // const search = () => {
  //   if (query != "" || query != null) {
  //     const filterarray = formData?.filter((e) => {
  //       if (e?.email?.toLowerCase().includes(query.toLowerCase())) {
  //         return e;
  //       }
  //     });
  //     setAllfilterData(filterarray);
  //   }
  // };
  const [showPass, setPassShow] = useState(false);
  const [user, setUser] = useState(null);

  const [isLoggedIn, setIsLoggedIn] = useState(false)

    useEffect(()=>{
      getAvatarInMyFun()
},[])
const getAvatarInMyFun =()=>{
if(localStorage.getItem("_id")){
  handleSubmit()
setIsLoggedIn(true);

}else{
console.log("condition false")
}
}

  useEffect(() => {
    // Fetch user data by ID when the component mounts
    const fetchUserById = async () => {
      const authToken = localStorage.getItem('token');
      try {
        const response = await fetch({
          url: `http://localhost:5000/user/${localStorage.getItem('_id')}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setUser(data.user);
        } else {
          toast.error("Failed to fetch user data");
        }
      } catch (error) {
        toast.error("An error occurred while fetching user data");
      }
    };
    if (id) fetchUserById();
  }, [BASE_URL, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const isStrongpassword = (password) => {
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
      toast.warn("Phone number is required");
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
    } else if (!isStrongpassword(formData.password)) {
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
        const authToken = localStorage.getItem('token');
        const response = await fetch({
          url: `http://localhost:5000/user/${localStorage.getItem('_id')}`,
          method: "GET",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        const data = await response.json();
        if (data.success === true) {
          toast.success("Profile created successfully");
          ref.current.complete();
          setTimeout(() => {
            navigate("/profile");
          }, 2000);
        } else {
          console.error("Profile creation failed");
          ref.current.complete();
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Profile creation failed");
        ref.current.complete();
        console.error("Error during profile creation:", error);
      }
    }
    ref.current.complete();
  };

  return (
    <div className="container">
      <LoadingBar color="#f11946" ref={ref} />
      <form className="form_container">
        <MdOutlineAirplaneTicket className="logo_container" />
        <div className="title_container">
          <p className="title">Full Info User Profile</p>
        </div>
        <div className="input_container">
          <label className="input_label" htmlFor="name_field">
            Name
          </label>
          <input
            required
            placeholder="John Smith"
            title="Input title"
            name="name"
            type="text"
            className="input_field"
            id="name_field"
            onChange={handleChange}
          />
        </div>
        <div className="input_container">
          <label className="input_label" htmlFor="phone_field">
            Phone Number
          </label>
          <input
            required
            placeholder="+91 881029988"
            title="Input title"
            name="phone"
            type="text"
            className="input_field"
            id="phone_field"
            onChange={handleChange}
          />
        </div>
        <div className="input_container">
          <label className="input_label" htmlFor="email_field">
            Email
          </label>
          <input
            required
            placeholder="Email"
            title="Input title"
            name="email"
            type="email"
            className="input_field"
            id="email_field"
            onChange={handleChange}
          />
        </div>
        <div className="input_container">
          <label className="input_label" htmlFor="password_field">
            Password
          </label>
          <input
            required
            placeholder="Password"
            title="Input title"
            name="password"
            type={showPass ? "text" : "password"}
            className="input_field"
            id="password_field"
            onChange={handleChange}
          />
          <div
            className="password-toggler"
            onClick={() => setPassShow(!showPass)}
          >
            {showPass ? <VscEye /> : <VscEyeClosed />}
          </div>
        </div>
        {formData.password && !isStrongpassword(formData.password) && (
          <span className="warning_msg">
            Password must contain at least 8 characters, one uppercase letter,
            one lowercase letter, one number, and one special character.
          </span>
        )}
        <button
          title="Create Profile"
          type="submit"
          className="sign-in_btn"
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

      {/* Display user data if available */}
      {user && (
        <div className="user_container">
          <h2>User Data</h2>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
          <p>Phone: {user.phone}</p>
          <p>PassWord: {user.password}</p>

        </div>
      )}

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

export default GetAllUserData;





//export default GetAllUserData;

