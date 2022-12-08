import apiConfig from '../../configs/service_api_config';
import axios, { AxiosRequestConfig } from 'axios';
import { getRequestBase } from './theiaservice_utils';

/* HELPER: https://github.com/eclipsesource/theia-cloud/blob/main/doc/docs/openapi.json

    What is what?
    appId => The App Id of this Theia.cloud instance. Request without a matching Id will be denied.
    user => The user identification, usually the email address.
    appDefinition => The app this workspace will be used with.
*/

export class TheiaServiceClient {
  group: string;
  namespace: string;
  apiUrl: string;
  authToken: string;

  constructor(authToken: any) {
    this.group = 'theia.cloud';
    this.namespace = 'theiacloud';
    this.apiUrl = apiConfig.apiUrl;
    this.authToken = authToken;
  }

  // Replies if the service is available.
  async checkIfServiceAliveWithAppId(appId: string): Promise<any> {
    const requestBase = getRequestBase(`${this.apiUrl}/service/${appId}`, this.authToken, 'get');
    const response = await axios(requestBase);
    return response.data;
  }

  // Replies if the service is available.
  async getUserWorkspaceList(appId: any, user: any): Promise<any> {
    const requestBase = getRequestBase(`${this.apiUrl}/service/workspace/${appId}/${user}`, this.authToken, 'get');
    const response = await axios(requestBase);
    return response.data;
  }

  // Request to create a new workspace.
  async createUserWorkspace(appId: string, user: any, appDefinition: string): Promise<any> {
    const requestBase = getRequestBase(
      `${this.apiUrl}/service/workspace`,
      this.authToken,
      'post',
      JSON.stringify({
        appId: appId,
        user: user,
        appDefinition: appDefinition,
      })
    );
    const response = await axios(requestBase);
    return response.data;
  }

  // Delete workspace
  async deleteUserWorkspace(appId: string, user: any, workspaceName: string): Promise<any> {
    const requestBase = getRequestBase(
      `${this.apiUrl}/service/workspace`,
      this.authToken,
      'delete',
      JSON.stringify({
        appId: appId,
        user: user,
        workspaceName: workspaceName,
      })
    );
    const response = await axios(requestBase);
    return response.data;
  }

  // Launches a session and creates a workspace if required. Responds with the URL of the launched session.
  async createSessionWithNewWorkspace(appId: string, user: any, appDefinition: string): Promise<any> {
    const requestBase = getRequestBase(
      `${this.apiUrl}/service`,
      this.authToken,
      'post',
      JSON.stringify({
        appId: appId,
        user: user,
        appDefinition: appDefinition,
        kind: "launchRequest",
        serviceUrl: this.apiUrl,
        "ephemeral": false
      })
    );
    const response = await axios(requestBase);
    return response.data;
  }

  // Starts a new session for an existing workspace and responds with the URL of the started session.
  async createSessionWithExistingWorkspace(
    appId: string,
    user: any,
    workspaceName: string,
    appDefinition: string
  ): Promise<any> {
    const requestBase = getRequestBase(
      `${this.apiUrl}/service/session`,
      this.authToken,
      'post',
      JSON.stringify({
        appId: appId,
        kind: "sessionStartRequest",
        serviceUrl: this.apiUrl,
        user: user,
        workspaceName: workspaceName,
        appDefinition: appDefinition,
        timeout: 5
      })
    );
    const response = await axios(requestBase);
    return response.data;
  }

  // Stops a session.
  async deleteSession(appId: string, user: any, sessionName: string): Promise<any> {
    const requestBase = getRequestBase(
      `${this.apiUrl}/service/session`,
      this.authToken,
      'delete',
      JSON.stringify({
        appId: appId,
        user: user,
        sessionName: sessionName,
      })
    );
    const response = await axios(requestBase);
    return response.data;
  }

  // List sessions
  async getSessionsList(appId: string, user: any): Promise<any> {
    const requestBase = getRequestBase(`${this.apiUrl}/service/session/${appId}/${user}`, this.authToken, 'get');
    const response = await axios(requestBase);
    return response.data;
  }

  // Returns the current CPU and memory usage of the session's pod.
  async getSessionMetricsList(appId: string, sessionName: any): Promise<any> {
    const requestBase = getRequestBase(
      `${this.apiUrl}/service/session/performance/${appId}/${sessionName}`,
      this.authToken,
      'get'
    );
    const response = await axios(requestBase);
    return response.data;
  }
}
