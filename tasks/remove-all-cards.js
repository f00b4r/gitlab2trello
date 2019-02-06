const CONFIG = require('./../config');

const _ = require('lodash');
const request = require("request-promise");

async function listCards() {
    const options = {
        method: 'GET',
        url: `https://api.trello.com/1/boards/${CONFIG.trello.boardId}/cards`,
        qs: {
            token: CONFIG.trello.token,
            key: CONFIG.trello.key
        }
    };

    const response = await request(options);
    const body = JSON.parse(response);

    console.log(body);

    _.forEach(body, async (card) => await deleteCard(card));
}

async function deleteCard(card) {
    const options = {
        method: 'DELETE',
        url: `https://api.trello.com/1/cards/${card.id}`,
        qs: {
            token: CONFIG.trello.token,
            key: CONFIG.trello.key
        }
    };

    const response = await request(options);
    const body = JSON.parse(response);

    console.log(response);
    console.log(body);
}

listCards();