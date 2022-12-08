import apiConfig from '../../configs/service_api_config';
import { AxiosHeaderObj } from './theiaservice_types';
import axios from 'axios';

/* HELPER: https://github.com/eclipsesource/theia-cloud/blob/main/doc/docs/openapi.json

    What is what?
    appId => The App Id of this Theia.cloud instance. Request without a matching Id will be denied.
    user => The user identification, usually the email address.
    appDefinition => The app this workspace will be used with.
*/

export class TheiaServiceClient {
  group: string;
  namespace: string;
  requestBase: AxiosHeaderObj;

  constructor(authToken: any) {
    this.group = 'theia.cloud';
    this.namespace = 'theiacloud';
    this.requestBase = {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
      url: `${apiConfig.apiUrl}`,
    };
  }

  // Replies if the service is available.
  async checkIfServiceAliveWithAppId(appId: string): Promise<any> {
    this.requestBase.url = this.requestBase.url + '/service/' + appId;
    this.requestBase.method = 'get';
    const response = await axios(this.requestBase);
    return response.data;
  }

  // Replies if the service is available.
  async getUserWorkspaceList(appId: any, user: any): Promise<any> {
    this.requestBase.url = this.requestBase.url + '/service/workspace/' + appId + '/' + user;
    console.log('this.requestBase.url', this.requestBase.url);
    this.requestBase.method = 'get';
    const response = await axios(this.requestBase);
    return response.data;
  }

  // Request to create a new workspace.
  async createUserWorkspace(appId: string, user: any): Promise<any> {
    // appDefinition can be added
    this.requestBase.url = this.requestBase.url + '/service/workspace';
    this.requestBase.method = 'post';
    this.requestBase.data = JSON.stringify({
      appId: appId,
      user: user,
    });
    const response = await axios(this.requestBase);
    return response.data;
  }

  // Delete workspace
  async deleteUserWorkspace(appId: string, user: any, workspaceName: string): Promise<any> {
    // appDefinition can be added
    this.requestBase.url = this.requestBase.url + '/service/workspace';
    this.requestBase.method = 'delete';
    this.requestBase.data = JSON.stringify({
      appId: appId,
      user: user,
      workspaceName: workspaceName,
    });
    const response = await axios(this.requestBase);
    return response.data;
  }

  // Launches a session and creates a workspace if required. Responds with the URL of the launched session.
  async createSessionWithNewWorkspace(appId: string, user: any): Promise<any> {
    this.requestBase.url = this.requestBase.url + '/service';
    this.requestBase.method = 'post';
    this.requestBase.data = JSON.stringify({
      appId: appId,
      user: user,
    });
    const response = await axios(this.requestBase);
    return response.data;
  }

  // Starts a new session for an existing workspace and responds with the URL of the started session.
  async createSessionWithExistingWorkspace(
    appId: string,
    user: any,
    workspaceName: string,
    appDefinition: string
  ): Promise<any> {
    this.requestBase.url = this.requestBase.url + '/service/session';
    this.requestBase.method = 'post';
    this.requestBase.data = JSON.stringify({
      appId: appId,
      user: user,
      workspaceName: workspaceName,
      appDefinition: appDefinition,
    });
    const response = await axios(this.requestBase);
    return response.data;
  }

  // Stops a session.
  async deleteSession(appId: string, user: any, sessionName: string): Promise<any> {
    this.requestBase.url = this.requestBase.url + '/service/session';
    this.requestBase.method = 'delete';
    this.requestBase.data = JSON.stringify({
      appId: appId,
      user: user,
      sessionName: sessionName,
    });
    const response = await axios(this.requestBase);
    return response.data;
  }

  // List sessions
  async getSessionsList(appId: string, user: any): Promise<any> {
    this.requestBase.url = this.requestBase.url + '/service/session' + appId + '/' + user;
    this.requestBase.method = 'get';
    const response = await axios(this.requestBase);
    return response.data;
  }
}
