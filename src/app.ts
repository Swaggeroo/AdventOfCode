import { getDayData } from "./getDayData";

getDayData(2020,14).then((result: string) => {
    console.log(result);
});

export {}