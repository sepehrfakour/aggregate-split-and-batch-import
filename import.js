const algoliasearch      = require('algoliasearch'),
      client             = algoliasearch(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_ADMIN_API_KEY),
      index              = client.initIndex(process.env.INDEX_NAME),
      contentDirName     = __dirname + '/../Test\ Content/', // Path to directory of JSON files to be imported
      CONTENT_MAX_LENGTH = 1000, // Max string length for each record.content
      CHUNK_SIZE         = 1000, // Number of records to index per batch
      chunk              = require('chunk-text');

const init = function () {
  let rawRecords       = [],
      formattedRecords = [],
      chunks           = [];

  // Create flat array of individual records from files containing JSON arrays
  require("fs").readdirSync(contentDirName).forEach((file) => {
    require(contentDirName + file).forEach((record) => rawRecords.push(record));
  });

  console.log("rawRecords.length:",rawRecords.length);

  // Enrich and format records
  rawRecords.forEach((post,index) => {
    let counter       = 1,
        content       = post.content,
        contentLength = (content === null) ? 0 : content.length;

    const contentChunks = chunk(content, CONTENT_MAX_LENGTH);
    contentChunks.forEach((contentChunk) => {
      const formattedPost = clone(post);
      formattedPost.post_id = counter;
      formattedPost.content = contentChunk;
      formattedRecords.push(formattedPost);
      counter++;
    });
  });

  for (var i = 0; i < formattedRecords.length; i += CHUNK_SIZE) {
    chunks.push(formattedRecords.slice(i, (i + CHUNK_SIZE)));
  }

  // Batch import
  batchImport = (chunks,remaining) => {
    if (remaining <= 0) { return false }
    let batch = chunks[(chunks.length - remaining)];

    console.log('\n--- Importing batch ---\n');

    index.addObjects(batch, function(err, content) {
      if (err) { throw err }
      //Index next batch
      index.waitTask(content.taskID, function() {
        console.log('\n--- Batch imported (size: ' + batch.length + ') ---\n');
        batchImport(chunks,remaining - 1);
      });
    });
  }
  batchImport(chunks,chunks.length);
};

const clone = function (obj) {
  return Object.assign({}, obj);
}

init();
