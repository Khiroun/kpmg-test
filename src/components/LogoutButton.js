import { useRouter } from "next/router";

const { Button } = require("@mui/material");

const LogoutButton = () => {
  const router = useRouter();
  const logout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };
  return (
    <Button
      variant="contained"
      color="error"
      style={{
        position: "fixed",
        bottom: "1rem",
        right: "1rem",
      }}
      onClick={logout}
    >
      Déconnexion
    </Button>
  );
};

export default LogoutButton;
