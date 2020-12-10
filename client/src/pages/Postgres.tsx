import React, {FC, useState} from 'react'

export const Postgres: FC = () => {

    const [searchQuery, setSearchQuery ]= useState<string>('')

    return (
        <>
            <h2>Search Dataset by Game Name</h2>
            <h2>Top Reviewed Games of All Time</h2>
            <h2>Top Reviewed Games by Genre</h2>
            <h2>Add your own Review!</h2> 
        </>
    )
}