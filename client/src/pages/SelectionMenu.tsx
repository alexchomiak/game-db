import React, { FC } from "react";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import { setDataset } from "../redux/splices/auth";
import { useDispatch } from "react-redux";
export const SelectionMenu: FC = () => {
  const dispatch = useDispatch();
  return (
    <>
      <h1> Select your dataset </h1>
      <div>
        <ListGroup>
          <ListGroupItem
            onClick={() => {
              dispatch(setDataset("pg"));
            }}
          >
            IGN Reviews ~ Postgres
          </ListGroupItem>
        </ListGroup>
      </div>
    </>
  );
};
