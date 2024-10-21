import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import boxLogo from "../assets/box_login.png";
import backgroundImage from "../assets/background_human_login.png"; // Import your background image

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard"); // Redirect to dashboard if token exists
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:3000/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token);
      navigate("/dashboard"); // Navigate to dashboard after successful login
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div style={styles.container}>
      <img style={styles.logoBox} src={boxLogo} alt="Logo" />
      <h1 style={styles.title}>Bem-Vindo</h1>
      <p style={styles.p}>
        Tenha a gestão do seu negócio <br /> na palma da sua mão
      </p>
      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          style={styles.input}
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          style={styles.input}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" style={styles.button}>
          Entrar
        </button>
      </form>
    </div>
  );
};

// Inline styles
const styles = {
  container: {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "300px 50%", // Set the desired width and height for the background image
    backgroundPosition: "top",
    backgroundRepeat: "no-repeat",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f4f4f4",
    padding: "20px",
    boxSizing: "border-box",
  },
  logoBox: {
    width: "100px",
  },
  p: {
    //add paddinf top
  },
  title: {
    marginBottom: "20px",
    fontSize: "2rem",
    color: "#000",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "300px",
    background: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  input: {
    marginBottom: "15px",
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "1rem",
  },
  button: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
};

export default LoginPage;
