export interface ignGame {
    title: string,
    score_phrase: string,
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