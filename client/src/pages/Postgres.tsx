import React, { FC, useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { ignGame, topIgnGame } from "../types/ign";
import { clearInterval, clearTimeout, setInterval } from "timers";
import { FormGroup, FormControl } from "react-bootstrap";
import { IgnReview } from "../components/IgnReview";
import { EditReview } from "../components/EditReview";

export const Postgres: FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [previousSearchQuery, setPreviousSearchQuery] = useState<string>(".")
    const [searchResults, setSearchResults] = useState<ignGame[]>([]);
    const [topGames, setTopGames] = useState<topIgnGame[]>([]);
    const [currentEdit, setCurrentEdit] = useState<ignGame | null>(null)
    useEffect(() => {
        if (topGames.length == 0) {
            (async () => {
                const { data: games } = await axios.get("/api/pg/games/top/25");
                setTopGames(games);
            })();
        }
    }, [topGames]);

    useEffect(() => {
        const i = setInterval(() => {
            if (searchQuery.length >= 3 && searchQuery != previousSearchQuery) {

                            ;(async () => {
                                console.log(searchQuery, previousSearchQuery)
                                const { data: games } = await axios.get(
                                    `/api/pg/search?q=${encodeURI(searchQuery)}`
                                );
                                setPreviousSearchQuery(searchQuery);

                                setSearchResults(games.splice(0,12));
                            })();
                        }
        }, 100)
        return () => {
            clearInterval(i)
        }   
    }, [searchQuery, previousSearchQuery])
    // useEffect(() => {
    //     let t = setTimeout(() => {
    //         setTimer(timer + 1)
    //         if (searchQuery.length > 0) {
    //             (async () => {
    //                 const { data: games } = await axios.get(
    //                     `/api/pg/search?q=${encodeURI(searchQuery)}`
    //                 );
    //                 setSearchResults(games);
    //             })();
    //         }
    //     }, 1000)
    //     return () => {
    //         clearTimeout(t)
    //     }
    // }, [timer])
    // useEffect(() => {
    //     console.log(intervalMounted)
    //     if(intervalMounted == 0) {
    //         setIntervalMounted(setInterval(() => {
    //             console.log(searchQuery)

    //             if (searchQuery.length > 0) {
    //                 (async () => {
    //                     const { data: games } = await axios.get(
    //                         `/api/pg/search?q=${encodeURI(searchQuery)}`
    //                     );
    //                     setSearchResults(games);
    //                 })();
    //             }
    //             //@ts-ignore
    //         }, 1000)._id)
    //     }

    //     return () => {

    //     }
    // }, [intervalMounted])

    return (
        <>
            {currentEdit != null && <EditReview game={currentEdit} open={currentEdit != null} onSubmit={(edit) => {
                if(edit != null) {
                    console.log(edit)
                }
                setCurrentEdit(null)
            }}/>}
            <h2>Search Dataset by Game Name</h2>
            <FormGroup>
                <FormControl
                    placeholder="Enter Search"
                    value={searchQuery}
                    onChange={(e) =>
                        setSearchQuery((e.target as HTMLInputElement).value)
                    }
                ></FormControl>
            </FormGroup>
            <div className="container-fluid">
                <div className="row justify-content-between">
                    {searchResults.map((res) => (<IgnReview onEdit={() => setCurrentEdit(res)} game={res}/>))}
                </div>
            </div>
            <h2>Top 25 Reviewed Games In The Datasets</h2>
            <div className="container-fluid">
                <div className="row justify-content-between">
                    {topGames.map((game: topIgnGame) => {
                        return (
                            <div
                                className="card col-md-3"
                                style={{ margin: "1rem" }}
                            >
                                <div className="card-body">
                                    <h5 className="card-title">
                                        {game.title} - <i>{game.genre}</i>
                                    </h5>
                                    <p className="card-text">
                                        Average Review Score:{" "}
                                        {game.averagescore}
                                    </p>
                                    <p className="card-text">
                                        Released: {game.releaseyear}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <h2>Top Reviewed Games by Genre</h2>
            <h2>Add your own Review!</h2>
        </>
    );
};
