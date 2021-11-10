"use strict";
import { gql } from "apollo-server";
import { GraphQLModule } from "@graphql-modules/core";

const typeDefs = gql`
  scalar Date

  input SortOptionsInput {
    key: String
    value: SortValue
  }

  enum SortValue {
    asc
    desc
  }
`;

const resolvers = {};

export default new GraphQLModule({
  typeDefs,
  resolvers,
  context: (session) => session,
});
