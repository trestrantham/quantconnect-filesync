// tslint:disable:object-literal-sort-keys

import axios, { AxiosResponse } from "axios";
import crypto from "crypto";

import { IQuantConnectFile, IQuantConnectProject } from "types";

const QUANTCONNECT_API_BASE_URL = "https://www.quantconnect.com/api/v2";

const client = axios.create({
  baseURL: QUANTCONNECT_API_BASE_URL,
});

const get = async (userId: string, token: string, endpoint: string, options = {}): Promise<AxiosResponse> => {
  const timestamp = getTimestamp();
  const hash = getTokenHash(token, timestamp);

  const response = await client.get(endpoint, {
    ...{
      auth: {
        username: userId,
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

const post = async (
  userId: string,
  token: string,
  endpoint: string,
  data = {},
  options = {},
): Promise<AxiosResponse> => {
  const timestamp = getTimestamp();
  const hash = getTokenHash(token, timestamp);

  const response = await client.post(endpoint, data, {
    ...{
      auth: {
        username: userId,
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

const getProjects = async (userId: string, token: string): Promise<IQuantConnectProject[]> => {
  const response = await get(userId, token, "/projects/read");

  return response.data.projects;
};

const getProject = async (userId: string, token: string, projectId: string): Promise<IQuantConnectProject> => {
  const response = await get(userId, token, `/projects/read?projectId=${projectId}`);

  return response.data.projects.length === 1 ? response.data.projects[0] : null;
};

const getFiles = async (userId: string, token: string, projectId: number): Promise<IQuantConnectFile[]> => {
  const response = await get(userId, token, `/files/read?projectId=${projectId}`);

  return response.data.files;
};

const addFile = async (userId: string, token: string, projectId: number, filename: string, content: string) => {
  const response = await post(userId, token, "/files/create", { projectId, name: filename, content });

  return response.data;
};

const deleteFile = async (userId: string, token: string, projectId: number, filename: string) => {
  const response = await post(userId, token, "/files/delete", { projectId, name: filename });

  return response.data;
};

const updateFile = async (userId: string, token: string, projectId: number, filename: string, content: string) => {
  const response = await post(userId, token, "/files/update", { projectId, name: filename, content });

  return response.data;
};

const getTimestamp = (): number => Math.floor(Number(new Date()) / 1000);
const getTokenHash = (token: string, timestamp: number) =>
  crypto
    .createHash("sha256")
    .update(`${token}:${timestamp}`)
    .digest("hex");

export default client;
export { addFile, deleteFile, getFiles, getProject, getProjects, updateFile };
