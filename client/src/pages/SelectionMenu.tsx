import React, { FC } from "react";
import { Button, Card, Col, Container, ListGroup, ListGroupItem, Row } from "react-bootstrap";
import { setDataset } from "../redux/splices/auth";
import { useDispatch } from "react-redux";
export const SelectionMenu: FC = () => {
  const dispatch = useDispatch();
  return (
    <>
      
      <Container>
        <Row className="justify-content-md-center">
          <Col xs lg="2"></Col>
          <Col md="auto">
            <h1> Select your dataset </h1>
          </Col>
          <Col xs lg="2"></Col>
        </Row>        
        <Row className="justify-content-md-center">
          <Col xs lg="2"></Col>
          <Col md="auto">
            {/* <div>
              <ListGroup>
                <ListGroupItem
                  
                >
                  IGN Reviews ~ Postgres

                </ListGroupItem>
              </ListGroup>
            </div>    */}

            <Card style={{ width: '18rem' }}>
                  <Card.Img variant="top" src="https://i.imgur.com/SSkfPrK.jpg" />
                  <Card.Body>
                    <Card.Title>PostgreSQL IGN Data</Card.Title>
                    <Card.Text>
                        IGN is your #1 destination for all video game news, expert reviews, and walkthroughs. 
                    </Card.Text>
                    <Button variant="primary" onClick={() => { dispatch(setDataset("pg"));}} >View data</Button>
                  </Card.Body>
            </Card>            

          </Col>
          <Col xs lg="2"></Col>
        </Row>
      </Container>

    </>
  );
};
