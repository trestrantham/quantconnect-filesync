// tslint:disable:object-literal-sort-keys

import axios, { AxiosResponse } from "axios";
import crypto from "crypto";

import { IQuantConnectFile, IQuantConnectProject } from "types";

const { QUANTCONNECT_USER_ID, QUANTCONNECT_TOKEN } = process.env;
const QUANTCONNECT_API_BASE_URL = "https://www.quantconnect.com/api/v2";

const client = axios.create({
  baseURL: QUANTCONNECT_API_BASE_URL,
});

const get = async (endpoint: string, options = {}): Promise<AxiosResponse> => {
  const timestamp = getTimestamp();
  const hash = getTokenHash(QUANTCONNECT_TOKEN, timestamp);

  const response = await client.get(endpoint, {
    ...{
      auth: {
        username: QUANTCONNECT_USER_ID,
        password: hash,
      },
      headers: {
        Timestamp: timestamp,
      },
    },
    ...options,
  });

  return response;
};

const post = async (endpoint: string, data = {}, options = {}): Promise<AxiosResponse> => {
  const timestamp = getTimestamp();
  const hash = getTokenHash(QUANTCONNECT_TOKEN, timestamp);

  const response = await client.post(endpoint, data, {
    ...{
      auth: {
        username: QUANTCONNECT_USER_ID,
        password: hash,
      },
      headers: {
        Timestamp: timestamp,
      },
    },
    ...options,
  });

  return response;
};

const getProjects = async (): Promise<IQuantConnectProject[]> => {
  const response = await get("/projects/read");

  return response.data.projects;
};

const getFiles = async (projectId: number): Promise<IQuantConnectFile[]> => {
  const response = await get(`/files/read?projectId=${projectId}`);

  return response.data.files;
};

const updateFile = async (projectId: number, filename: string, content: string) => {
  const response = await post("/files/update", { projectId, name: filename, content });

  return response.data;
};

const getTimestamp = (): number => Math.floor(Number(new Date()) / 1000);
const getTokenHash = (token: string, timestamp: number) =>
  crypto
    .createHash("sha256")
    .update(`${token}:${timestamp}`)
    .digest("hex");

export default client;
export { getFiles, getProjects, updateFile };
