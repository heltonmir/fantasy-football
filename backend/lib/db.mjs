"use strict";
import { MongoClient, ObjectId } from "mongodb";
let dbConnection = null;
const url = "mongodb://localhost:27017/proFantasy";

const collections = {
  PLAYER: "rawPlayer",
  USER_TEAM: "userTeam",
};

const init = async () => {
  const params = { useNewUrlParser: true };
  const db = await MongoClient.connect(url, params);
  if (!db) return false;
  dbConnection = db;
  return true;
};

const getDb = async () => {
  if (!dbConnection) await init();
  return dbConnection?.db();
};

const closeDb = () => {
  dbConnection?.close();
  return true;
};

const toObjectId = (strId) => new ObjectId(strId);

export { init, getDb, closeDb, collections, toObjectId };
