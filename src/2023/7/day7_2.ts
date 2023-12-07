import { getDayData } from "../../getDayData";

getDayData(2023,7).then((result: string) => {
    let solultion: number = 0;



    let lines: string[] = result.split('\n');
    lines.pop();

    let hands: Hand[] = [];

    for(let line of lines){
        let hand: Hand = {
            cards: line.split(' ')[0],
            rank: 0,
            bid: parseInt(line.split(' ')[1])
        }
        hands.push(hand);
    }

    for (let hand of hands){
        let cards: string[] = hand.cards.split('');
        let rank: number = 0;
        let map: Map<string, number> = new Map();
        for (let card of cards){
            if(map.has(card)){
                map.set(card, map.get(card)! + 1);
            }else{
                map.set(card, 1);
            }
        }

        let j: number = 0;
        if (map.has('J')){
            j = map.get('J')!;
        }

        if (j === 5){
            rank = Math.max(6, rank);
        }else if (j === 4){
            rank = Math.max(5, rank);
        }else if (j === 3){
            rank = Math.max(3, rank);
        }

        for (let [key, value] of map){
            if (key !== 'J'){
                if(value + j === 5){
                    rank = Math.max(6, rank);
                }else if(value + j === 4){
                    rank = Math.max(5, rank);
                }else if(value + j === 3){
                    rank = Math.max(3, rank);
                }
            }
        }

        if (rank < 4 && (map.size == 2 || (map.size == 3 && j > 0))){
            rank = 4;
        }else if (rank < 3){
            if (j >= 2){
                rank = Math.max(2, rank);
            }else{
                let pairs: number = 0;
                for (let [key, value] of map){
                    if(value === 2 && key !== 'J'){
                        pairs++;
                    }
                }
                if (pairs === 2) {
                    rank = Math.max(2, rank);
                }else if (pairs === 1 && j >= 1){
                    rank = Math.max(2, rank);
                }else if (pairs === 1){
                    rank = Math.max(1, rank);
                }else if (pairs === 0 && j >= 1){
                    rank = Math.max(1, rank);
                }
            }
        }

        hand.rank = rank;
    }

    hands.sort((a: Hand, b: Hand) => {
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
    });

    let rank = 1;
    for (let i: number = hands.length - 1; i >= 0; i--){
        let hand: Hand = hands[i];
        solultion += hand.bid * rank;
        rank++;
    }


    console.log(solultion);
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

interface Hand{
    cards: string,
    rank: number,
    bid: number
}


export {}