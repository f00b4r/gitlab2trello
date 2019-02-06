const CONFIG = require('./../config');
const CONNECTOR = require('./../connector');

const BUFFER_START = 0;
const BUFFER_END = 100;

const _ = require('lodash');
const request = require("request-promise");

const project = require(CONFIG.gitlab.project);

const timeout = ms => new Promise(res => setTimeout(res, ms));

async function migrateIssues() {
    const buffer = _.slice(project.issues, BUFFER_START, BUFFER_END);

    for (let i = 0; i < buffer.length; i++) {
        await migrateIssue(buffer[i]);
        await timeout(2000);
    }
}

async function migrateIssue(issue) {
    const listId = issue.milestone ?
        lookupList(issue.milestone.title)
        : lookupList("Backlog");

    const labels = issue.label_links ?
        lookupLabels(
            _.map(issue.label_links, label_link => {
                return label_link.label.title;
            })
        )
        : "";

    const members = lookupMembers(issue.author_id, _.map(issue.issue_assignees, ia => ia.user_id));

    await createCard(listId, issue.title, issue.description, labels, members, issue);
}

function lookupList(milestone) {
    return _.find(CONNECTOR.trello.lists, { name: milestone }).id;
}

function lookupLabels(labels) {
    return _.filter(CONNECTOR.trello.labels, label => {
        return labels.indexOf(label.name) !== -1;
    })
        .map(label => label.id)
        .join(',');
}

function lookupMembers(author, issue) {
    const ids = [];

    if (CONNECTOR.trello.users[author] !== undefined) {
        ids.push(CONNECTOR.trello.users[author]);
    } else {
        ids.push(CONNECTOR.trello.users['_']);
    }

    if (issue && CONNECTOR.trello.users[issue] !== undefined) {
        ids.push(CONNECTOR.trello.users[issue]);
    }

    return _.uniq(ids).join(',');
}

async function createCard(listId, name, description, labels, members, issue) {
    const options = {
        method: 'POST',
        url: 'https://api.trello.com/1/cards',
        qs: {
            token: CONFIG.trello.token,
            key: CONFIG.trello.key,
            name: name,
            desc: description,
            idLabels: labels,
            idMembers: members,
            idList: listId
        }
    };

    const response = await request(options);
    const body = JSON.parse(response);

    console.log(`Card #${body.id} created`);

    _.filter(issue.notes, note => note.system === false)
        .forEach(async (note) => {
            await createComment(body.id, note.author_id, note.note);
        });
}

async function createComment(cardId, author, note) {
    const text = `By ${CONNECTOR.gitlab.users[author]}: ${note}`

    const options = {
        method: 'POST',
        url: `https://api.trello.com/1/cards/${cardId}/actions/comments`,
        qs: {
            token: CONFIG.trello.token,
            key: CONFIG.trello.key,
            text: text,
        }
    };

    const response = await request(options);
    const body = JSON.parse(response);

    console.log(`Comment created for #${cardId}`);
}

migrateIssues()