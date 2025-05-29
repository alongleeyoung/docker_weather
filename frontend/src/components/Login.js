import React, { useState } from "react";
import axios from "axios";

function Login() {
  const [form, setForm] = useState({
    id: "",
    pw: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("http://localhost:3001/login", form);

      if (response.data.success) {
        localStorage.setItem("isLoggedIn", true);
        alert("로그인 성공!!");
        window.location.href = "/tour";
      } else {
        alert("로그인에 실패했습니다.");
      }
    } catch (error) {
      setError(
        error.response
          ? error.response.data.message
          : "서버에 문제가 발생했습니다."
      );
      console.error("There was an error!", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = () => {
    window.location.href = "/signup";
  };

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: "#f0f0f0",
    },
    formContainer: {
      backgroundColor: "#ffffff",
      padding: "20px",
      borderRadius: "8px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
    },
    heading: {
      marginBottom: "20px",
      color: "#333333",
    },
    form: {
      display: "flex",
      flexDirection: "column",
    },
    input: {
      padding: "10px",
      marginBottom: "10px",
      border: "1px solid #cccccc",
      borderRadius: "4px",
      fontSize: "16px",
    },
    button: {
      padding: "10px",
      backgroundColor: "#4CAF50",
      color: "white",
      border: "none",
      borderRadius: "4px",
      fontSize: "16px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
      marginBottom: "10px",
    },
    signUpButton: {
      padding: "10px",
      backgroundColor: "#008CBA",
      color: "white",
      border: "none",
      borderRadius: "4px",
      fontSize: "16px",
      cursor: "pointer",
      transition: "background-color 0.3s ease",
    },
    error: {
      color: "red",
      marginTop: "10px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.heading}>로그인</h2>
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            name="id"
            placeholder="Email"
            value={form.id}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="password"
            name="pw"
            placeholder="Password"
            value={form.pw}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <button onClick={handleSignUp} style={styles.signUpButton}>
          Sign Up
        </button>
        {error && <div style={styles.error}>에러가 발생했습니다: {error}</div>}
      </div>
    </div>
  );
}

export default Login;
