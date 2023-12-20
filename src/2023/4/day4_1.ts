import { getDayData } from "../../util/getDayData";

getDayData(2023,4).then((result: string) => {
    let solultion: number = 0;

    let lines: string[] = result.split('\n');
    lines.pop();

    let cards: Card[] = [];
    for (let i: number = 0; i < lines.length; i++) {
        let line: string = lines[i];
        let card: Card = {
            winningNumbers: [],
            numbers: []
        };

        let game: string = line.split(':')[1];
        let numbers: string[] = game.split('|');
        let winningNumbers: string[] = numbers[0].split(' ');
        winningNumbers.pop();
        winningNumbers.shift()

        let numbersNumbers: string[] = numbers[1].split(' ');
        numbersNumbers.shift()

        for (let j: number = 0; j < winningNumbers.length; j++) {
            if (Number(winningNumbers[j]) != 0) {
                card.winningNumbers.push(Number(winningNumbers[j]));
            }
        }

        for (let j: number = 0; j < numbersNumbers.length; j++) {
            if (Number(numbersNumbers[j]) != 0) {
                card.numbers.push(Number(numbersNumbers[j]));
            }
        }

        cards.push(card);
    }

    for (let i: number = 0; i < cards.length; i++) {
        let card: Card = cards[i];
        let winningNumbers: number[] = card.winningNumbers;
        let numbers: number[] = card.numbers;

        let matches: number = 0;
        for (let j: number = 0; j < numbers.length; j++) {
            if(winningNumbers.includes(numbers[j])){
                matches++;
            }
        }

        if(matches > 0){
            solultion += 2**(matches-1);
        }
    }

    console.log(solultion);
});

interface Card {
    winningNumbers: number[];
    numbers: number[];
}

export {}