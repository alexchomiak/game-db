import React, { FC } from "react";
import { Button } from "react-bootstrap";
import { ignGame } from "../types/ign";
interface ReviewProps {
    game: ignGame;
    onEdit?: () => void
}
export const IgnReview: FC<ReviewProps> = ({ game, onEdit }) => {
    return (
        <div className="card col-md-3" style={{ margin: "1rem" }}>
            <div className="card-body">
                <h5 className="card-title">
                    {game.title} - <i>{game.genre}</i>
                </h5>
                <a href={"https://ign.com" + game.url} target="_blank">
                    Go to review
                </a>
                <p className="card-text">
                    Review Score: {game.scorephrase}, {game.score}
                </p>
                <p className="card-text">
                    Released: {game.releasemonth}/{game.releaseday}/
                    {game.releaseyear}
                </p>
                <Button onClick={() => {
                    if(onEdit) onEdit()
                }}>Edit</Button>
            </div>
        </div>
    );
};
