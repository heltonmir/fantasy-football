"use strict";
import { gql, ApolloError } from "apollo-server";
import { GraphQLModule } from "@graphql-modules/core";
import {
  listPlayers as _listPlayers,
  getPlayer as _getPlayer,
} from "../features/player.mjs";

const typeDefs = gql`
  type Query {
    listPlayers(
      params: ListPlayerSearchInput
      skip: Float
      limit: Float
      sort: [SortOptionsInput]
    ): [Player]

    getPlayer(params: GetPlayerSearchInput!): Player
  }

  type Player {
    id: ID!
    name: String
    nationality: [String]
    position: String
    age: Float
    team: String
  }

  input ListPlayerSearchInput {
    name: String
    team: String
    position: String
    nationality: String
  }

  input GetPlayerSearchInput {
    id: ID
  }
`;

const resolvers = {
  Query: {
    listPlayers: async (_, args, context) => {
      const { params, skip, limit, sort } = args;
      try {
        const players = await _listPlayers(params, sort, skip, limit);
        return players;
      } catch (error) {
        console.error(new Date(), "listPlayer::", error);
        return new ApolloError("APP_ERROR");
      }
    },

    getPlayer: async (_, args, context) => {
      const { params } = args;
      try {
        const player = await _getPlayer(params);
        return player;
      } catch (error) {
        console.error(new Date(), "getPlayer::", error);
        return new ApolloError("APP_ERROR");
      }
    },
  },

  Player: {
    id: ({ _id }) => _id,
    age: ({ birth }) => {
      const birthYear = new Date(birth).getFullYear();
      return new Date().getFullYear() - birthYear;
    },
  },
};

export default new GraphQLModule({
  typeDefs,
  resolvers,
  context: (session) => session,
});
