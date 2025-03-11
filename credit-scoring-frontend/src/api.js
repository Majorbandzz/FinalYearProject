import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000", //This is where my flask backend will be displayed
});

export default API;
