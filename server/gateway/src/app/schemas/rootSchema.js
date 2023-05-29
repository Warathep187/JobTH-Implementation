import * as auth from "./auth";
import * as profile from "./profile";
import * as jobs from "./jobs";
import * as applications from "./applications";
import * as jobsSearching from "./jobsSearching";
import { merge } from "lodash";
import { DateScalar, DateTimeScalar } from "graphql-date-scalars";

const moduleTypeDefs = [auth.typeDefs, profile.typeDefs, jobs.typeDefs, applications.typeDefs, jobsSearching.typeDefs];

const moduleQueries = [auth.queries, profile.queries, jobs.queries, applications.queries, jobsSearching.queries];

const moduleMutations = [auth.mutation, profile.mutations, jobs.mutations, applications.mutations];

const typeDefs = `#graphql
  scalar DateTime
  scalar Date

  type ResponseMessage {
    msg: String!
  }

  ${moduleTypeDefs.join("\n")}

  type Query {
    ${moduleQueries.join("\n")}
  }

  type Mutation {
    ${moduleMutations.join("\n")}
  }

  schema {
    query: Query,
    mutation: Mutation
  }
`;

const scalarTypes = {
  DateTime: DateTimeScalar,
  Date: DateScalar,
};

const resolver = merge(
  scalarTypes,
  auth.resolvers,
  profile.resolvers,
  jobs.resolvers,
  applications.resolvers,
  jobsSearching.resolvers
);

export { typeDefs, resolver };
