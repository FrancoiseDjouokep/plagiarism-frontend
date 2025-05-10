
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Oauth2Success = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const refresh = params.get("refresh");

    if (token && refresh) {
      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refresh);
      navigate("/home");
    } else {
      navigate("/login");
      console.log("echec de connexion");
    }
  }, [location, navigate]);

  return <p>Connexion réussie, redirection...</p>;
};

export default Oauth2Success;
