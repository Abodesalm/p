let space = "local";
let API_URL;
if (space === "local") {
  API_URL = `http://127.0.0.1:8000`;
} else if (space === "host") {
  API_URL = `https://zed-games-api.onrender.com`;
}

const api = {
  main_api: `${API_URL}/api`,
};

export const {
  main_api,
} = api;
