import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export async function register(username, email, password) {
  try {
    const response = await api.post("/auth/register", {
      username,
      email,
      password,
    });

    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function login(email, password) {
  try {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getMe() {
  try {
    const response = await api.get("/auth/get-me");

    return response.data;
  } catch (err) {
    if (err.response && err.response.status === 401) {
      return null; // Not authenticated
    }
    console.log(err);
    throw err;
  }
}

export async function logout() {
  try {
    const response = await api.get("/auth/logout");

    return response.data;
  } catch (err) {
    console.log(err);
    throw err;
  }
}
