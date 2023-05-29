const jobMapping = {
  properties: {
    id: {
      type: "keyword",
    },
    position: {
      type: "text",
      analyzer: "position_ngram_2_4",
    },
    salary: {
      properties: {
        min: {
          type: "integer",
        },
        max: {
          type: "integer",
        },
      },
    },
    location: {
      properties: {
        district: {
          type: "keyword",
        },
        province: {
          type: "keyword",
        },
      },
    },
    companyId: {
      type: "keyword",
    },
    tags: {
      type: "keyword",
    },
    createdAt: {
      type: "date",
    },
  },
};

const jobSettings = {
  index: {
    max_ngram_diff: "5",
  },
  analysis: {
    tokenizer: {
      position_ngram_2_4: {
        type: "ngram",
        min_gram: 2,
        max_gram: 4,
      },
    },
    analyzer: {
      position_ngram_2_4: {
        tokenizer: "position_ngram_2_4",
        filter: ["lowercase"],
      },
    },
  },
};

export { jobMapping, jobSettings };
