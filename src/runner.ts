import * as readline from 'readline';
import { exec } from 'child_process';

const DEFAULT_YEAR = '2023';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question(`Enter the year (${DEFAULT_YEAR}): `, (year) => {
    year = year || DEFAULT_YEAR;
    rl.question('Enter the day [1-24]: ', (day) => {
        rl.question('Enter the part [1,2]: ', (part) => {
            exec(`tsc`, (error, stdout, stderr) => {
                if (error) {
                    console.log(`Error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                console.log(`${stdout}`);
            });

            exec(`node ./dist/${year}/${day}/day${day}_${part}.js`, (error, stdout, stderr) => {
                if (error) {
                    console.log(`Error: ${error.message}`);
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
                    return;
                }
                console.log(`${stdout}`);
            });

            rl.close();
        });
    });
});

export {}