"use strict";
import { getDb, collections } from "../lib/db.mjs";
import { prepareSortParams, normaliseQueryParams } from "./utils.mjs";

const listPlayers = async (params, sort = [], skip = 0, limit = 50) => {
  const db = await getDb();
  const sortParams = prepareSortParams(sort);
  const cursor = db
    .collection(collections.PLAYER)
    .find(normaliseQueryParams(params))
    .sort(sortParams)
    .skip(skip)
    .limit(limit);
  const players = [];
  for await (const doc of cursor) players.push(doc);
  await cursor.close();
  return players;
};

const getPlayer = async (params) => {
  const db = await getDb();
  const player = await db
    .collection(collections.PLAYER)
    .findOne(normaliseQueryParams(params));
  return player;
};

export { listPlayers, getPlayer };
