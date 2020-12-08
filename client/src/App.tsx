import React from "react";
import { Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import Auth from "./pages/Auth";
import { logout } from "./redux/splices/auth";
import { RootState } from "./redux/store";
function App() {
  const auth = useSelector((store: RootState) => store.auth);
  const dispatch = useDispatch();
  return (
    <div className="App">
      {!auth.user && <Auth />}
      {auth.user && (
        <>
          <h1>Hello {auth.user.firstName}</h1>
          <Button
            onClick={() => {
              dispatch(logout());
            }}
          >
            Logout
          </Button>
        </>
      )}
    </div>
  );
}

export default App;
