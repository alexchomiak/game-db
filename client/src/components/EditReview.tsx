import React, {FC, useState} from 'react'
import {Modal, FormGroup, FormControl, ModalTitle, Button } from 'react-bootstrap'
import { ignGame } from '../types/ign'

interface EditReviewProps {
    game: ignGame,
    open: boolean,
    onSubmit: (edit: ignGame | null) => void
}

export const EditReview: FC<EditReviewProps> = ({game, open, onSubmit}) => {

    const [review, setReview] = useState<ignGame>(game);

    return <div >
        <Modal
            show={open}
            onHide= {() => {}}        >
            <Modal.Header>
                <ModalTitle>
                    Edit Review for {review.title}
                </ModalTitle>
            </Modal.Header>
            <Modal.Body>
                {Object.entries(review).map(([key,value]) => {
                    if(key == "id") return <> </>
                    return <FormGroup>
                        <p><i>{key}</i></p>
                        <FormControl
                                placeholder="Enter First Name"
                                value={value}
                                onChange={(e) =>
                                   {
                                    const val = (e.target as HTMLInputElement).value
                                    //@ts-ignore
                                    review[key] = val
                                    setReview({...review})
                                   }
                                }
                            ></FormControl>
                    </FormGroup>
                
                })}
    
            </Modal.Body>

            <Modal.Footer>
                <Button onClick={() => {
                    onSubmit(review)
                }}>Submit Edit</Button>
                <Button type="danger" onClick={() => {
                    onSubmit(null)
                }}>Close</Button>
            </Modal.Footer>
        </Modal>
    </div>
}