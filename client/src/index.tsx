import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "bootstrap/dist/css/bootstrap.min.css";
import store from "./redux/store";
import { setUser } from "./redux/splices/auth";
import { Provider } from "react-redux";

/*
 * NOTICE: If you are getting linter errors in your editor
 * make sure your editor is running Typescript v4.1.2 or above
 */

// * Check for user in local storage
const serializedUser = localStorage.getItem("user");
if (serializedUser && serializedUser != "") {
    const user = JSON.parse(serializedUser);
    store.dispatch(setUser(user));
}

ReactDOM.render(
    <Provider store={store}>
        <React.StrictMode>
            <App />
        </React.StrictMode>
    </Provider>,
    document.getElementById("root")
);
