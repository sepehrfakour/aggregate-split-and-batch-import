# Aggregate-split-and-batch-import

A node script to array-aggregate the contents of multiple JSON files, split any JSON records with long text content into multiple numbered/associated records, and batch import them to an Algolia index.

# Requirements:

- node.js

# Usage:

1) Clone this repo, and `cd` into it via command-line

2) Run `npm install`

3) Set the following env vars (ideally using environment variables, or alternatively, inline inside `import.js`)
- ALGOLIA_APPLICATION_ID
- ALGOLIA_ADMIN_API_KEY
- INDEX_NAME

4) Set path to directory containing JSON files that need to be imported (inline inside `import.js`)

5) Run `node import.js`
