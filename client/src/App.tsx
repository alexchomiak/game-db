import React from "react";
import { Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import Auth from "./pages/Auth";
import { logout } from "./redux/splices/auth";
import { RootState } from "./redux/store";
import { SelectionMenu } from "./pages/SelectionMenu";
import NavMenu from "./components/NavMenu";
import { Postgres } from "./pages/Postgres";
function App() {
    const auth = useSelector((store: RootState) => store.auth);
    const dispatch = useDispatch();
    return (
        <div className="App">
            <NavMenu />
            {!auth.user && <Auth />}
            {auth.user && (
                <>
                    {auth.currentDataset == null && <SelectionMenu />}
                    {auth.currentDataset != null &&
                        (() => {
                            switch (auth.currentDataset) {
                                case "pg":
                                    // TODO: Render PG data
                                    return <> <Postgres/> </>;
                                default:
                                    return (
                                        <p>Selected {auth.currentDataset} </p>
                                    );
                            }
                        })()}
                </>
            )}
        </div>
    );
}

export default App;
