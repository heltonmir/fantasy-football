"use strict";
import { ApolloServer } from "apollo-server";
import { buildFederatedSchema } from "@apollo/federation";
import { GraphQLModule } from "@graphql-modules/core";
import schemas from "./schemas/index.mjs";

const PORT = 9100;

/**
 * Merge all subschemas into a single main one.
 */
const mergeSchemas = () => new GraphQLModule({ imports: schemas });

/**
 * Generate Federated GrapqhQL schema with directives
 */
const generateGraphqlSchema = () => {
  const { typeDefs, resolvers } = mergeSchemas();
  const schema = buildFederatedSchema([{ typeDefs, resolvers }]);
  return schema;
};

/**
 * Creates a GraqhQL context object for the resolvers
 * @param {*} req
 */
const createContext = (req) => {
  const language = req.headers["language"];
  return { language };
};

/**
 * Creates a new instance of Apollo Sever with all the schemas, directives
 * and context generated
 */
const start = () => {
  const schema = generateGraphqlSchema();
  const server = new ApolloServer({
    schema,
    context: ({ req }) => createContext(req),
    debug: false,
  });
  server.listen({ port: PORT }).then(({ url }) => {
    console.log(`Server ready at ${url}`);
  });
};

start();
