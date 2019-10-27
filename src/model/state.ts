import { BookDesc } from "booka-common";
import { Theme } from "../atoms";

export type AppState = {
    books: BookDesc[],
    theme: Theme,
};
