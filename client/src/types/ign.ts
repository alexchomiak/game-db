export interface ignGame {
    id: string,
    title: string,
    scorephrase: string,
    url: string,
    platform: string,
    score: number,
    genre: string,
    editorschoice: boolean,
    releaseyear: number,
    releasemonth: number,
    releaseday: number
}

export interface topIgnGame {
    title: string,
    averagescore: number,
    genre: string,
    editorschoice: boolean,
    releaseyear: number
}