import React, { useState } from "react";
import { Form, FormGroup, Input, Button, Alert } from "reactstrap";
import { useNavigate } from "react-router-dom";
import "../../styles/login.css";

const Login = ({ setIsLoggedIn }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validateUser = async (username, password) => {
    try {
      const response = await fetch('/data/users.csv');
      const csvText = await response.text();
      const users = csvText
        .split('\n')
        .slice(1) // Skip header row
        .filter(line => line.trim() !== '') // Filter out empty lines
        .map(line => {
          const [user = '', pass = ''] = line.split(',');
          if (!user || !pass) return null;
          return { 
            username: user.trim(), 
            password: pass.trim() 
          };
        })
        .filter(user => user !== null); // Remove any null entries

      console.log('Users from CSV:', users);

      return users.some(user => 
        user.username === username && user.password === password
      );
    } catch (error) {
      console.error('Error reading users:', error);
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (await validateUser(username, password)) {
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
      alert('Login successful! Welcome back!');
      navigate('/home');
    } else {
      setError('Invalid username or password');
      alert('Login failed! Please check your credentials.');
    }
  };

  return (
    <div className="login__container">
      <div className="login__form">
        <h2>Login</h2>
        {error && <Alert color="danger">{error}</Alert>}
        <Form onSubmit={handleSubmit}>
          <FormGroup>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </FormGroup>
          <FormGroup>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FormGroup>
          <Button color="primary" block>
            Login
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default Login; 