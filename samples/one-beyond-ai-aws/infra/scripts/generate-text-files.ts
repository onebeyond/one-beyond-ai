import * as fs from 'fs';

const FOLDER = '../movies/metadata';
const OUTPUT_FOLDER = '../movies/files';

(async () => {
  const jsonFiles = fs.readdirSync(FOLDER);
  for (const jsonFile of jsonFiles) {
    const json = JSON.parse(fs.readFileSync(`${FOLDER}/${jsonFile}`, 'utf8'));
    const text = `Title: ${json.title}\nRank: ${json.rank}\nYear: ${json.year}\nRating: ${json.rating}\nPlot: ${json.plot}\n`
    fs.writeFileSync(`${OUTPUT_FOLDER}/${jsonFile.replace('.json', '.txt')}`, text);
  }
})();
