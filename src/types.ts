interface IQuantConnectCollaborator {
  id: number;
  uid: number;
  blivecontrol: boolean;
  epermission: string;
  profileimage: string;
  name: string;
}

interface IQuantConnectFile {
  name: string;
  content: string;
  modified: string;
  projectId: number;
  open: number;
  userHasAccess: boolean;
  readOnly: boolean;
}

interface IQuantConnectProject {
  projectId: number;
  name: string;
  modified: string;
  created: string;
  ownerId: number;
  language: string;
  collaborators: IQuantConnectCollaborator[];
  leanVersionId: number;
  owner: boolean;
  description: string;
  channelId: string;
  parameters: [];
  liveResults: {
    eStatus: string;
    sDeployID: null;
    sServerType: null;
    dtLaunched: null;
    dtStopped: null;
    sBrokerage: null;
    sSecurityTypes: null;
    dUnrealized: null;
    dfees: null;
    dnetprofit: null;
    dEquity: null;
    dHoldings: null;
    dCapital: null;
    dVolume: null;
    iTrades: null;
    sErrorMessage: null;
  };
  libraries: [];
  isAlphaStreamDeployment: number;
  grid: null;
  liveGrid: null;
  files: IQuantConnectFile[];
}

export { IQuantConnectCollaborator, IQuantConnectFile, IQuantConnectProject };
