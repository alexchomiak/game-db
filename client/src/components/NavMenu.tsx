import React, { FC } from "react";
import { Navbar, NavbarBrand, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { logout } from "../redux/splices/auth";
import "./NavMenu.css";
export const NavMenu: FC = () => {
    const dispatch = useDispatch();
    return (
        <>
            <Navbar className="navbar  justify-content-between">
                <NavbarBrand href="#home">Brand link</NavbarBrand>
                <Button
                    onClick={() => {
                        dispatch(logout());
                    }}
                >
                    Logout
                </Button>
            </Navbar>
        </>
    );
};

export default NavMenu;
