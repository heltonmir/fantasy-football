"use strict";
import { toObjectId } from "../lib/db.mjs";

const prepareSortParams = (params) =>
  params.reduce((result, entry) => {
    result[entry.key] = entry.value === "desc" ? -1 : 1;
    return result;
  }, {});

const normaliseQueryParams = (params = {}) => {
  const keys = Object.keys(params);
  for (let idx = 0, len = keys.length; idx < len; idx += 1) {
    const key = keys[idx];
    if (key === "id") {
      params["_id"] = toObjectId(params[key]);
      delete params[key];
    } else if (key === "ids") {
      params["_id"] = { $in: params[key].map((id) => toObjectId(id)) };
      delete params[key];
    } else if (Array.isArray(params[key])) params[key] = { $in: params[key] };
  }
  return params;
};

export { prepareSortParams, normaliseQueryParams };
