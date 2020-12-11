import React, {FC, useState} from 'react'
import {Modal, FormGroup, FormControl, ModalTitle, Button } from 'react-bootstrap'
import { ignGame } from '../types/ign'

interface AddReviewProps {
    open: boolean,
    onSubmit: (edit: ignGame | null) => void
}

export const AddReview: FC<AddReviewProps> = ({open, onSubmit}) => {

    const [review, setReview] = useState<ignGame>({
        id: "",
        title: "",
        url:"",
        platform: "",
        score: 0,
        genre: "",
        editorschoice: false,
        releaseyear: new Date().getUTCFullYear(),
        releasemonth: new Date().getUTCMonth() + 1,
        releaseday: new Date().getUTCDate() - 1,
        scorephrase: "Average"
    });

    return <div >
        <Modal
            show={open}
            onHide= {() => {}}        >
            <Modal.Header>
                <ModalTitle>
                    Add Review for {review.title}
                </ModalTitle>
            </Modal.Header>
            <Modal.Body>
                {Object.entries(review).map(([key,value]) => {
                    if(key == "id") return <> </>
                    return <FormGroup>
                        <p><i>{key}</i></p>
                        <FormControl
                                placeholder={`Enter value for ${key}`}
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
                }}>Submit Review</Button>
                <Button type="danger" onClick={() => {
                    onSubmit(null)
                }}>Close</Button>
            </Modal.Footer>
        </Modal>
    </div>
}