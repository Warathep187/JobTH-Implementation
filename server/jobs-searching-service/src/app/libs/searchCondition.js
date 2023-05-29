const getSearchConditionQuery = ({ keyword, salaryMin, salaryMax, district, province, tags }) => {
  const splittedTags = tags.split(",").filter((tagId) => /^(?=[a-f\d]{24}$)(\d+[a-f]|[a-f]+\d)/i.test(tagId));
  const tagsMatchTerms = splittedTags.map((tagId) => ({
    term: {
      tags: tagId,
    },
  }));
  const mustCondition = [
    {
      bool: {
        must: tagsMatchTerms,
      },
    },
  ];
  if (keyword !== "") {
    mustCondition.push({
      multi_match: {
        query: keyword,
        fields: ["position"],
        operator: "and",
      },
    });
  }
  mustCondition.push({
    bool: {
      must: [
        {
          range: {
            "salary.min": {
              gte: salaryMin,
            },
          },
        },
        {
          range: {
            "salary.max": {
              lte: salaryMax,
            },
          },
        },
      ],
    },
  });
  const locationCondition = [];
  if (province !== "") {
    locationCondition.push({
      match: {
        "location.province": province,
      },
    });
    if (district !== "") {
      locationCondition.push({
        match: {
          "location.district": district,
        },
      });
    }
  }
  if (locationCondition.length > 0) {
    mustCondition.push({
      bool: {
        must: locationCondition,
      },
    });
  }
  return {
    bool: {
      must: mustCondition,
    },
  };
};

export default {
  getSearchConditionQuery,
};
