import { getDayData } from "../../util/getDayData";

getDayData(2023,7).then((result: string) => {
    let solution: number = 0;

    let lines: string[] = result.split('\n');
    lines.pop();

    let hands: Hand[] = lines.map((line: string) => new Hand(line));

    hands.sort(Hand.compare);

    let rank = 1;
    for (let i: number = hands.length - 1; i >= 0; i--){
        solution += hands[i].bid * rank;
        rank++;
    }

    console.log(solution);
});

function letterToNumber(letter: string): number{
    switch (letter){
        case 'A':
            return 14;
        case 'K':
            return 13;
        case 'Q':
            return 12;
        case 'J':
            return 1;
        case 'T':
            return 10;
        default:
            return parseInt(letter);
    }
}

class Hand {
    cards: string;
    rank: number;
    bid: number;

    constructor(line: string) {
        this.cards = line.split(' ')[0];
        this.bid = parseInt(line.split(' ')[1]);
        this.rank = this.getRank(this.cards);
    }

    private getRank(cardString: string) {
        let cards: string[] = cardString.split('');
        let rank: number = 0;
        let cardCount: Map<string, number> = new Map();

        cards.forEach((card: string) => {
            cardCount.set(card, cardCount.has(card) ? cardCount.get(card)! + 1 : 1);
        });

        let jokers: number = cardCount.has('J') ? cardCount.get('J')! : 0;

        let maxCardCount: number = 0;
        for (let [key, value] of cardCount){
            if (key !== 'J' && value > maxCardCount){
                maxCardCount = value;
            }
        }

        //Card Multiple same Cards
        if(maxCardCount + jokers === 5){
            rank = Math.max(6, rank);
        }else if(maxCardCount + jokers === 4){
            rank = Math.max(5, rank);
        }else if(maxCardCount + jokers === 3){
            rank = Math.max(3, rank);
        }

        //Full House and Pairs
        if (rank < 4 && (cardCount.size == 2 || (cardCount.size == 3 && jokers > 0))){
            rank = 4;
        }else if (rank < 3){
            let pairs: number = 0;
            for (let [key, value] of cardCount){
                if(value === 2 && key !== 'J'){
                    pairs++;
                }
            }

            if (pairs === 2 || jokers >= 2 || (pairs === 1 && jokers >= 1)) {
                rank = Math.max(2, rank);
            }else if (pairs === 1 || (pairs === 0 && jokers >= 1)){
                rank = Math.max(1, rank);
            }
        }

        return rank;
    }

    public static compare(a: Hand, b: Hand) {
        if(a.rank !== b.rank){
            return b.rank - a.rank;
        }else {
            for (let i = 0; i < a.cards.length; i++){
                if (letterToNumber(a.cards[i]) !== letterToNumber(b.cards[i])){
                    return letterToNumber(b.cards[i]) - letterToNumber(a.cards[i]);
                }
            }
        }

        return 0;
    }
}

export {}