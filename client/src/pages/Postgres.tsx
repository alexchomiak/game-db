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
    Col,
    Nav,
    Row,
    Tab,
    Container,
} from "react-bootstrap";
import { IgnReview } from "../components/IgnReview";
import { EditReview } from "../components/EditReview";
import { AddReview } from "../components/AddReview";

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

            <br/>

            <Container>
                <Row className="justify-content-md-center">
                    <Col xs lg="2"></Col>
                    <Col md="auto">
                        <Button onClick={() => setAddReview(true)}>Add A Review</Button>
                    </Col>
                    <Col xs lg="2"></Col>
                </Row>
            </Container>

            <br/>

<Tab.Container id="left-tabs-example" defaultActiveKey="first">
  <Row>
    <Col sm={3}>
      <Nav variant="pills" className="flex-column">
        <Nav.Item>
          <Nav.Link eventKey="first">Search Dataset by Game Name</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="second">Top Reviewed Games by Genre</Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="third">Top 25 Reviewed Games In The Dataset</Nav.Link>
        </Nav.Item>        
      </Nav>
    </Col>
    <Col sm={9}>
      <Tab.Content>
        <Tab.Pane eventKey="first">
          
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

        </Tab.Pane>
        <Tab.Pane eventKey="second">          
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

          
        </Tab.Pane>
        <Tab.Pane eventKey="third">

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

        </Tab.Pane>      
      
      </Tab.Content>
    </Col>
  </Row>
</Tab.Container>










        </>
    );
};
