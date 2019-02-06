# Gitlab2Trello

Easy to use nodejs-based scripts for migrate Gitlab project into Trello board.

## Usage

**Preparation**

1. Export Gitlab project.
2. Move `project.json` into **data** folder.
3. Create Trello board.
4. Setup `/config.js`. (`token`, `key`, `boardId` and `boardShortId`.
   1. Take a look at https://trello.com/app-key.
   2. API docs https://developers.trello.com/v1.0/reference#introduction.
5. Take a look at folder `/tasks`.

**Tasks**

### `remove-all-cards`

Cleanup all cards from your trello board. Great for testing.

```
node tasks/remove-all-cards.js
```

### `labels2labels`

Convert Gitlab labels to Trello labels. With default blue color.

```
node tasks/labels2labels.js
```

### `milestones2lists`

Convert all milestones into board's lists.

```
node tasks/milestones2lists.js
```

### `issues2cards`

Convert all issues with discussion into cards with comments.

```
node tasks/issues2cards.js
```

Take a look at this task closer, it needs to be configured. 

**Batching limit**

```
const BUFFER_START = 0;
const BUFFER_END = 100;
```

**Connector**

You have to store labels and lists from Trello into connector.js to match the issues properly.

- Dump all labels (`https://api.trello.com/1/boards/{boardId}/labels?token={TOKEN}&key={KEY}`)
- Dump all lists (`https://api.trello.com/1/boards/{boardId}/lists?token={TOKEN}&key={KEY}`)

You should also map the Gitlab users into connector.

-----

Feel free to open PR with new tasks.