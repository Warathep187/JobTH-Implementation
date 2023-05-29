import { GraphQLError as GQLError } from "graphql";

const codeCollection = {
  400: "BAD_INPUT",
  401: "UNAUTHORIZED",
  403: "ACCESS_DENIED",
  409: "CONFLICT",
  500: "INTERNAL_SERVER_ERROR",
};

class CustomGraphQLError extends GQLError {
  constructor(e) {
    super(e.response.data.msg);
    
    this.extensions = {
      code: codeCollection[`${e.response.status}`],
    };
  }
}

export default CustomGraphQLError;
