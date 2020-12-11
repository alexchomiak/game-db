import React, { FC } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { ignGame } from "../types/ign";
interface ReviewProps {
    game: ignGame;
    onEdit?: () => void;
    onDelete: (id: string) => void
}
export const IgnReview: FC<ReviewProps> = ({ game, onEdit, onDelete }) => {
    return (
        <div className="card col-md-4" style={{ margin: "0rem" }}>
            <div className="card-body">

                <Container>
                    <Row  >
                        <Col>
                            <h6 className="card-title">
                                {game.title} - <i>{game.genre} ({game.platform})</i>
                            </h6>                        
                        </Col>                                                                                            
                    </Row>


                    <Row>
                        <Col>
                            <a href={"https://ign.com" + game.url} target="_blank">
                                Go to review
                            </a>                        
                        </Col>
                    </Row>

                    <br/>

                    <Row>
                        <Col>
                            <p className="card-text">
                                Rating Score: {game.score}
                            </p>

                            <p className="card-text">
                                Rating Label: {game.scorephrase}
                            </p>

                        </Col>

                    </Row>

                    <br/>

                    <Row>
                        <Col>
                            <p className="card-text">
                                Released: {game.releasemonth}/{game.releaseday}/
                                {game.releaseyear}
                            </p>
                        </Col>
                    </Row>
                    
                    <br/>

                    <Row>
                         <Col>
                             <Button onClick={() => { if(onEdit) onEdit() }} block>Edit</Button>
                         </Col>                        
                    </Row>

                    <br/>

                    <Row>
                        <Col>
                            <Button variant="danger" onClick={() => { onDelete(game.id) }} block> Delete Review </Button>
                        </Col>
                    </Row>

                </Container>

            </div>
        </div>
    );
};
