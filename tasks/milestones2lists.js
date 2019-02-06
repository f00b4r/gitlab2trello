const CONFIG = require('./../config');

const _ = require('lodash');
const request = require("request");

const project = require(CONFIG.gitlab.project);

function migrateMilestones() {
    _.forEach(project.milestones, milestone => migrateMilestone(milestone));
}
function migrateMilestone(milestone) {
    createList(milestone.title);
}

function createList(milestone) {

    const options = {
        method: 'POST',
        url: 'https://api.trello.com/1/lists',
        qs: {
            token: CONFIG.trello.token,
            key: CONFIG.trello.key,
            name: milestone,
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

migrateMilestones()