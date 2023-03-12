import React, { useState } from "react";

import { useAuth0 } from "@auth0/auth0-react";

const LoginButton = () => {
  const {
    user,
    isAuthenticated,
    loginWithRedirect,
    logout,
  } = useAuth0();

  const logoutWithRedirect = () =>
    logout({
        logoutParams: {
          returnTo: window.location.origin,
        }
    });

  const buttonText = isAuthenticated ? "Log Out" : "Log In";

  return (
    <div>
        <button onClick={() => isAuthenticated ? logoutWithRedirect() : loginWithRedirect()}>{buttonText}</button>
    </div>
  );
};

export default LoginButton;