"use strict";
import { toObjectId } from "../lib/db.mjs";
import { getDb, collections } from "../lib/db.mjs";
import { prepareSortParams, normaliseQueryParams } from "./utils.mjs";

const listUserTeams = async (params, sort = [], skip = 0, limit = 50) => {
  const db = await getDb();
  const sortParams = prepareSortParams(sort);
  const cursor = db
    .collection(collections.USER_TEAM)
    .find(normaliseQueryParams(params))
    .sort(sortParams)
    .skip(skip)
    .limit(limit);
  const teams = [];
  for await (const doc of cursor) teams.push(doc);
  await cursor.close();
  return teams;
};

const getUserTeam = async (params) => {
  const db = await getDb();
  const team = await db
    .collection(collections.USER_TEAM)
    .findOne(normaliseQueryParams(params));
  return team;
};

const createUserTeam = async (params) => {
  const db = await getDb();
  const result = await db.collection(collections.USER_TEAM).insertOne(params);
  if (!result.insertedId) throw Error("Unable to create user team");
  return db
    .collection(collections.USER_TEAM)
    .findOne({ _id: result.insertedId });
};

const updateUserTeam = async (params) => {
  const query = { _id: toObjectId(params.id) };
  delete params.id;
  const result = await db
    .collection(collections.USER_TEAM)
    .updateOne(query, { $set: params });
  if (result.modifiedCount < 1) throw Error("Unable to update user team");
  return db.collection(collections.USER_TEAM).findOne(query);
};

export { listUserTeams, getUserTeam, createUserTeam, updateUserTeam };
