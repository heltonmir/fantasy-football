"use strict";
import { gql, ApolloError } from "apollo-server";
import { GraphQLModule } from "@graphql-modules/core";
import { listPlayers as _listPlayers } from "../features/player.mjs";
import {
  listUserTeams as _listUserTeams,
  getUserTeam as _getUserTeam,
  createUserTeam as _createUserTeam,
  updateUserTeam as _updateUserTeam,
} from "../features/userTeam.mjs";

const typeDefs = gql`
  type Query {
    listUserTeams(
      params: listUserTeamsSearchInput
      sort: SortOptionsInput
      skip: Float
      limit: Float
    ): [UserTeam]

    getUserTeam(params: getUserTeamSearchInput!): UserTeam
  }

  type Mutation {
    createUserTeam(params: createUserTeamInput!): UserTeam

    updateUserTeam(params: updateUserTeamInput!): UserTeam
  }

  input listUserTeamsSearchInput {
    name: String
    creator: String
  }

  input getUserTeamSearchInput {
    id: ID!
  }

  type UserTeam {
    id: ID!
    name: String
    nickname: String
    creator: String
    colors: [Float]
    players: [Player]
  }

  input createUserTeamInput {
    name: String
    nickname: String
    creator: String
    colors: [Float]
  }

  input updateUserTeamInput {
    id: ID
    name: String
    nickname: String
    colors: [Float]
    playersId: [ID]
  }
`;

const resolvers = {
  Query: {
    listUserTeams: async (_, args, context) => {
      try {
        const { params, sort, skip, limit } = args;
        const teams = await _listUserTeams(params, sort, skip, limit);
        return teams;
      } catch (error) {
        console.error(new Date(), "listUserTeams::", error);
        throw new ApolloError("APP_ERRROR");
      }
    },

    getUserTeam: async (_, args, context) => {
      try {
        const { params } = args;
        const team = await _getUserTeam(params);
        return team;
      } catch (error) {
        console.error(new Date(), "getUserTeam::", error);
        throw new ApolloError("APP_ERRROR");
      }
    },
  },

  Mutation: {
    createUserTeam: async (_, args, context) => {
      try {
        const { params } = args;
        const team = await _createUserTeam(params);
        return team;
      } catch (error) {
        console.error(new Date(), "createUserTeam::", error);
        throw new ApolloError("APP_ERRROR");
      }
    },

    updateUserTeam: async (_, args, context) => {
      try {
        const { params } = args;
        const team = await _updateUserTeam(params);
        return team;
      } catch (error) {
        console.error(new Date(), "updateUserTeam::", error);
        throw new ApolloError("APP_ERRROR");
      }
    },
  },

  UserTeam: {
    id: ({ _id }) => _id,
    players: async ({ players = [] }) => {
      const params = { ids: players };
      const sort = [{ key: "postion", value: "asc" }];
      return _listPlayers(params, sort);
    },
  },
};

export default new GraphQLModule({
  typeDefs,
  resolvers,
  context: (session) => session,
});
