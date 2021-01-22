import { Settings } from './settings.js';

Settings.on({ coll: 'movies', name: 'aviv'}, (fullDocument, { value }) => {
    console.log(`aviv's from the settings collection is now: ${value}`)
});

Settings.on({ coll: 'movies', name: 'shalom'}, (fullDocument, { value }) => {
    console.log(`shalom's from the settings collection is now: ${value}`)
});