import React, { FC, useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { ignGame, topIgnGame } from "../types/ign";
import { clearInterval, clearTimeout, setInterval } from "timers";
import {
    FormGroup,
    FormControl,
    Button,
    DropdownButton,
    Dropdown,
} from "react-bootstrap";
import { IgnReview } from "../components/IgnReview";
import { EditReview } from "../components/EditReview";
import { AddReview } from "../components/AddReview";
import DropdownMenu from "react-bootstrap/lib/DropdownMenu";

export const Postgres: FC = () => {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [previousSearchQuery, setPreviousSearchQuery] = useState<string>(".");
    const [searchResults, setSearchResults] = useState<ignGame[]>([]);
    const [topGames, setTopGames] = useState<topIgnGame[]>([]);
    const [currentEdit, setCurrentEdit] = useState<ignGame | null>(null);
    const [addReview, setAddReview] = useState(false);
    const [genres, setGenres] = useState<string[]>([]);
    const [currentGenre, setCurrentGenre] = useState<string>("");
    const [topGamesGenre, setTopGamesGenre] = useState<topIgnGame[]>([]);
    const updateSearchResults = async () => {
        if (searchQuery.length >= 3) {
            const { data: games } = await axios.get(
                `/api/pg/search?q=${encodeURI(searchQuery)}`
            );
            setPreviousSearchQuery(searchQuery);

            setSearchResults(games.splice(0, 12));
        }
    };

    const updateTopGames = async () => {
        const { data: games } = await axios.get("/api/pg/games/top/25");
        setTopGames(games);
    };

    const updateGenres = async () => {
        const { data: genres } = await axios.get("/api/pg/genres");
        setGenres(genres as string[]);
    };
    const updateGenreList = async (genre?: string) => {
        console.log("updating with ", currentGenre)
        if (currentGenre != "" || genre != "") {
            const { data: list } = await axios.get(
                `/api/pg/games/top/25?genre=${encodeURI(currentGenre)}`
            );
            setTopGamesGenre(list);
        } else if(genre != "") {
            const { data: list } = await axios.get(
                `/api/pg/games/top/25?genre=${encodeURI(genre)}`
            );
            setTopGamesGenre(list);
        }
    };
    const update = () => {
        updateSearchResults();
        updateTopGames();
        updateGenres();
        updateGenreList();
    };

    useEffect(() => {
        if (topGames.length == 0) {
            update();
        }
    }, [topGames]);

    useEffect(() => {
        const i = setInterval(() => {
            if (searchQuery.length >= 3 && searchQuery != previousSearchQuery) {
                update();
            }
        }, 100);
        return () => {
            clearInterval(i);
        };
    }, [searchQuery, previousSearchQuery]);
    return (
        <>
            {addReview && (
                <AddReview
                    open={addReview}
                    onSubmit={async (review) => {
                        if (review) {
                            console.log(review);
                            await axios.post("/api/pg/add", {
                                review,
                            });
                            update();
                        }
                        setAddReview(false);
                    }}
                />
            )}
            {!addReview && currentEdit != null && (
                <EditReview
                    game={currentEdit}
                    open={currentEdit != null}
                    onSubmit={async (edit) => {
                        if (edit != null) {
                            console.log(edit);

                            try {
                                await axios.post("/api/pg/update", {
                                    review: edit,
                                });
                                update();
                            } catch (err) {
                                alert("updating err");
                            }
                        }
                        setCurrentEdit(null);
                    }}
                />
            )}
            <h2>Search Dataset by Game Name</h2>
            <Button onClick={() => setAddReview(true)}>Add A Review</Button>
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
                    {searchResults.map((res) => (
                        <IgnReview
                            onDelete={async (id) => {
                                const res = await axios.post("/api/pg/delete", {
                                    id,
                                });
                                update();
                            }}
                            onEdit={() => setCurrentEdit(res)}
                            game={res}
                        />
                    ))}
                </div>
            </div>
            <h2>Top Reviewed Games by Genre</h2>
            <DropdownButton
                id="dropdown-basic-button"
                title={currentGenre || "Pick Genere"}
            >   
   
                {genres.map((genre) => (
                    //@ts-ignore
                    <Dropdown.Item
                        onClick={() => {
                            setCurrentGenre(genre)
                            updateGenreList(genre)
                        }}
                    >
                        {genre} {/* @ts-ignore */}
                    </Dropdown.Item>
                ))}
            
            </DropdownButton>
            <div className="container-fluid">
                <div className="row justify-content-between">
                    {topGamesGenre.map((game: topIgnGame) => {
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
                </div>{" "}
            </div>
            <h2>Top 25 Reviewed Games In The Dataset</h2>
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
        </>
    );
};
