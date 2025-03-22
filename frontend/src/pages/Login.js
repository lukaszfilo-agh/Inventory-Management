import { useState } from "react";
import axios from "axios";

const Login = ({ setToken }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const response = await axios.post("http://localhost:8000/login", {
                username,
                password,
            });
            setToken(response.data.access_token);
            localStorage.setItem("token", response.data.access_token);
        } catch (error) {
            alert("Invalid credentials");
        }
    };

    return (
        <div>
            <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
            <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;