import React, { FC, useState } from "react";
import { Button, Form, FormControl, InputGroup, Modal } from "react-bootstrap";
// import { GameGenres } from '../data/GameGenres'
import axios from 'axios';


export const AddOwnReview: FC =  () => {    
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const ratings = [1,2,3,4,5,6,7,8,9,10];
    // const genres = await

                // (async () => {
                //     const genres = await axios.get(`/api/pg/genres}`);
                // })();


        
    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Add your own review
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                <Modal.Title>Add your own game review</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    Add input fields here
                    {/* FIXME: auto-increment id */}

                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-default">Title</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl aria-label="Default" aria-describedby="inputGroup-sizing-default"/>
                    </InputGroup>


                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-default">Rating (0-10)</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl aria-label="Default" aria-describedby="inputGroup-sizing-default"/>
                    </InputGroup>

                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-default">Platform</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl aria-label="Default" aria-describedby="inputGroup-sizing-default"/>
                    </InputGroup>

                    <InputGroup className="mb-3">
                        <InputGroup.Prepend>
                            <InputGroup.Text id="inputGroup-sizing-default">Genre</InputGroup.Text>
                        </InputGroup.Prepend>
                        <FormControl aria-label="Default" aria-describedby="inputGroup-sizing-default"/>
                    </InputGroup>

                    <Form>
                        <Form.Group controlId="exampleForm.SelectCustom">
                            <Form.Label>Custom select</Form.Label>
                            <Form.Control as="select" custom>

                            {
                                ratings.map(element => {
                                   return <option>{element}</option>
                                })
                            }

                            </Form.Control>
                        </Form.Group>
                    </Form>                    

                    
                    {/* TODO: 
                        
                        USE A DROPDOWN:  score phrase, rating, platform, genre, editors_choice, score
                        
                        use calendar element
                        
                        ign url */}

                </Modal.Body>
                
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleClose}>
                    Save Changes
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AddOwnReview;
