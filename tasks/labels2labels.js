const CONFIG = require('./../config');

const _ = require('lodash');
const request = require("request");

const project = require(CONFIG.gitlab.project);

function migrateLabels() {
    _.forEach(project.labels, label => migrateLabel(label));
}
function migrateLabel(label) {
    createLabel(label.title);
}

function createLabel(name, color = 'blue') {

    const options = {
        method: 'POST',
        url: 'https://api.trello.com/1/labels',
        qs: {
            token: CONFIG.trello.token,
            key: CONFIG.trello.key,
            name: name,
            color: color,
            idBoard: CONFIG.trello.boardId
        }
    };

    request(options, function (error, response, body) {
        if (error) {
            console.log(error);
            throw new Error(error);
        }

        console.log(body);
    });
}

migrateLabels()