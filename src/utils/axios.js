import axios from "axios";

const api = axios.create({
    baseURL: "https://dev.menejment2.uz/api/v1/",
});

export default api;
