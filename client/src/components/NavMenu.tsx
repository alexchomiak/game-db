import React, { FC } from "react";
import { Navbar, NavbarBrand, Button, Form, FormControl, Nav } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { logout } from "../redux/splices/auth";
// import "./NavMenu.css";
export const NavMenu: FC = () => {
    const dispatch = useDispatch();
    return (
        <>

            <Navbar bg="primary" variant="dark">
                <Navbar.Brand href="#home">Game Reviews DB</Navbar.Brand>
                <Nav className="mr-auto">
                </Nav>
                <Button onClick={() => { dispatch(logout());}} variant="outline-light">Logout</Button>
            </Navbar>            

        </>
    );
};

export default NavMenu;
