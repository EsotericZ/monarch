import { Button, Stack } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { _logout, _setauthtoken } from "../../../redux";

const LogOutButton: React.FC = () => {
  const dispatch = useDispatch();
 const location = useLocation();

  const handleLogOut = () => {    
    dispatch(_logout());
    dispatch(_setauthtoken(''))
    location.pathname = "/"
  };

  return (
    <Stack>
      <Button onClick={handleLogOut}>Log Out</Button>      
    </Stack>
  );
};

export default LogOutButton;
