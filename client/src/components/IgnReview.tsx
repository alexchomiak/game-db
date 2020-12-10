import React, { FC } from "react";
import { ignGame } from "../types/ign";
interface ReviewProps {
    game: ignGame
}
export const IgnReview: FC<ReviewProps> =  ({game}) => {
    return (
        <div className="card col-md-3" style={{ margin: "1rem" }}>
            <div className="card-body">
                <h5 className="card-title">
                    {game.title} - <i>{game.genre}</i>
                </h5>
                <a href={"https://ign.com" + game.url}>Go to review</a>
                <p className="card-text">
                    Review Score: {game.score_phrase}, {game.score}
                </p>
                <p className="card-text">
                    Released: {game.releasemonth}/{game.releaseday}/
                    {game.releaseyear}
                </p>
            </div>
        </div>
    );
};
