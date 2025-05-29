import React, { useState } from "react";
import axios from "axios";

function SignUp() {
  const [form, setForm] = useState({
    id: "",
    pw: "",
    userName: "",
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

    console.log("유저값: ", form);

    try {
      const response = await axios.post("http://localhost:3001/signup", form);

      if (response.data.success) {
        alert("회원가입이 완료되었습니다.");
        window.location.href = "/";
      } else {
        alert("회원가입에 실패했습니다. 다시 시도해 주세요.");
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
    },
    buttonHover: {
      backgroundColor: "#45a049",
    },
    error: {
      color: "red",
      marginTop: "10px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.heading}>회원가입</h2>
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
          <input
            type="text"
            name="userName"
            placeholder="Username"
            value={form.userName}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <button
            type="submit"
            disabled={loading}
            style={
              loading
                ? { ...styles.button, ...styles.buttonHover }
                : styles.button
            }
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </button>
        </form>
        {error && <div style={styles.error}>에러가 발생했습니다: {error}</div>}
      </div>
    </div>
  );
}

export default SignUp;
