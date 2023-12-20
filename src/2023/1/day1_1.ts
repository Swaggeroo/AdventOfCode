import { getDayData } from "../../util/getDayData";

getDayData(2023,1).then((result: string) => {
    let solution :number = 0;

    for(let i: number = 0; i<result.length; i++){
        let first: string = "-1";
        let last: string = "-1";
        while(result[i] !== "\n"){
            if(result[i].match(/[0-9]/)){
                if(first === "-1"){
                    first = result[i];
                }else{
                    last = result[i];
                }
            }
            i++;
        }
        if(last === "-1"){
            last = first;
        }
        solution += Number((first + "") + (last + ""));
    }

    console.log(solution);

});

export {}