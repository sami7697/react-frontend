import React, { useEffect, useState } from "react";
import axios from "axios";
import '../signin.css';

const Signin = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (editUserId !=null) {
    //   // Update existing user
    //   try {
    //     await axios.put(`http://localhost:21020/api/signin/${userData.id}`, userData);
    //     setEditUserId(null);
    //     setUserData({ userName: '', userEmail: '', userPassword: '' });
    //     allUsers();
    //   } catch (error) {
    //     console.error("Update error:", error);
    //   }
    // } else {
      // Create new user
      try {
        await axios.post("http://localhost:21020/api/signin", userData);
        setUserData({ userName: '', userEmail: '', userPassword: '' });
        allUsers();
      } catch (error) {
        console.error("Signup error:", error);
      }
    // }
  };

  const allUsers = () => {
    axios.get("http://localhost:21020/api/signin")
      .then((res) => setUsers(res.data.users))
      .catch((error) => console.error("Fetch error:", error));
  };

  const handleEdit = (user) => {
    setUserData({
      userName: user.name,
      userEmail: user.email,
      userPassword: user.password, // Not ideal; password should not be exposed
      id:user._id
    });
    setEditUserId(user._id); // or user.id depending on backend
  };

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`http://localhost:21020/api/signin/${userId}`);
      allUsers();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };


  useEffect(() => {
    allUsers();
  }, []);

  return (
    <div className="container">
      <div className="header">
        <div className="text">{editUserId ? "Edit User" : "Sign in"}</div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="inputs">
          <div className="input-data">
            <input
              name="name"
              type="text"
              placeholder="Name"
              value={userData.userName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-data">
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={userData.userEmail}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-data">
            <input
              name="password"
              type="password"
              placeholder="Password"
              value={userData.userPassword}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit"  className="submit">
          Sign In
        </button>
      </form>

      <div>
        <h3>All Users</h3>
        {users.map((user) => (
          <div key={user._id} style={{ color: 'black', margin: '10px 0' }}>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <button onClick={() => handleEdit(user)}>Edit</button>
            <button onClick={() => handleDelete(user._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Signin;
