import axios from "axios";

const API_URL = "http://localhost:5000";

export const reviewCode = async (language, code) => {
  const res = await axios.post(
    `${API_URL}/review`,
    {
      language,
      code,
    }
  );

  return res.data;
};
