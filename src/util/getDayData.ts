import { URL } from "url";
import fs from "node:fs";

function getDayData(year: number, day: number): Promise<string>{
    return new Promise<string>((resolve, reject)=>{
        try{
            if(!fs.existsSync(`./days/${year}/${day}.txt`)){
                const url: URL = new URL(`https://adventofcode.com/${year}/day/${day}/input`);
                fetch(url.toString(),{
                    headers:{
                        Cookie: `session=${process.env.AOC_SESSION}`
                    }
                })
                .then(result => result.text())
                .then(text => {
                    fs.mkdirSync(`./days/${year}/`, { recursive: true });
                    fs.writeFileSync(`./days/${year}/${day}.txt`, text);
                    resolve(text);
                });
            }else{
                fs.readFile(`./days/${year}/${day}.txt`, 'utf8', (err: any, data: string) => {
                    if (err) {
                      reject(err);
                      return;
                    }
                    resolve(data);
                  });
            }
        }catch(exeption){
            reject(exeption);
        }
    });
}

export { getDayData };