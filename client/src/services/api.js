import axios from 'axios'; export const reviewCode=(language,code)=>axios.post(`${import.meta.env.VITE_API_URL||'http://localhost:5000'}/review`,{language,code}).then(r=>r.data);
