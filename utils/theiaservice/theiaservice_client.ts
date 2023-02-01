import apiConfig from '../../configs/service_api_config';
import axios, { AxiosError, AxiosInstance } from 'axios';
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
  handleAxiosError(error: any): Error {
    if (error.response) {
      throw new Error(`Request failed with status code ${error.response.status}: ${error.response.statusText}`);
    } else if (error.request) {
      throw new Error(`Request error: No response was received`);
    } else {
      throw new Error(`Request error: ${error.message}`);
    }
  }

  // Replies if the service is available.
  async checkIfServiceAliveWithAppId(appId: string): Promise<any> {
    try {
      const requestBase = getRequestBase(`${this.apiUrl}/service/${appId}`, this.authToken, 'get');
      const response = await axios(requestBase);
      return response.data;
    } catch (error: any) {
      this.handleAxiosError(error);
    }
  }

  // Replies if the service is available.
  async getUserWorkspaceList(appId: any, user: any): Promise<any> {
    try {
      const requestBase = getRequestBase(`${this.apiUrl}/service/workspace/${appId}/${user}`, this.authToken, 'get');
      const response = await axios(requestBase);
      return response.data;
    } catch (error: any) {
      this.handleAxiosError(error);
    }
  }

  // Request to create a new workspace.
  async createUserWorkspace(appId: string, user: any, appDefinition: string): Promise<any> {
    try {
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
    } catch (error: any) {
      this.handleAxiosError(error);
    }
  }

  // Delete workspace
  async deleteUserWorkspace(appId: string, user: any, workspaceName: string): Promise<any> {
    try {
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
    } catch (error: any) {
      this.handleAxiosError(error);
    }
  }

  // Launches a session and creates a workspace if required. Responds with the URL of the launched session.
  async createSessionWithNewWorkspace(appId: string, user: any, appDefinition: string): Promise<any> {
    try {
      const requestBase = getRequestBase(
        `${this.apiUrl}/service`,
        this.authToken,
        'post',
        JSON.stringify({
          appId: appId,
          user: user,
          appDefinition: appDefinition,
          kind: 'launchRequest',
          serviceUrl: this.apiUrl,
          ephemeral: false,
        })
      );
      const response = await axios(requestBase);
      return response.data;
    } catch (error: any) {
      this.handleAxiosError(error);
    }
  }

  // Starts a new session for an existing workspace and responds with the URL of the started session.
  async createSessionWithExistingWorkspace(
    appId: string,
    user: any,
    workspaceName: string,
    appDefinition: string
  ): Promise<any> {
    try {
      const requestBase = getRequestBase(
        `${this.apiUrl}/service/session`,
        this.authToken,
        'post',
        JSON.stringify({
          appId: appId,
          kind: 'launchRequest',
          serviceUrl: this.apiUrl,
          user: user,
          workspaceName: workspaceName,
          appDefinition: appDefinition,
          timeout: 5,
        })
      );
      const response = await axios(requestBase);
      return response.data;
    } catch (error: any) {
      this.handleAxiosError(error);
    }
  }

  // Stops a session.
  async deleteSession(appId: string, user: any, sessionName: string): Promise<any> {
    try {
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
    } catch (error: any) {
      this.handleAxiosError(error);
    }
  }

  // List sessions
  async getSessionsList(appId: string, user: any): Promise<any> {
    try {
      const requestBase = getRequestBase(`${this.apiUrl}/service/session/${appId}/${user}`, this.authToken, 'get');
      const response = await axios(requestBase);
      return response.data;
    } catch (error: any) {
      this.handleAxiosError(error);
    }
  }

  // Returns the current CPU and memory usage of the session's pod. NOT AVAILABLE AT THE MOMENT!
  async getSessionMetricsList(appId: string, sessionName: any): Promise<any> {
    try {
      const requestBase = getRequestBase(
        `${this.apiUrl}/service/session/performance/${appId}/${sessionName}`,
        this.authToken,
        'get'
      );
      const response = await axios(requestBase);
      return response.data;
    } catch (error: any) {
      this.handleAxiosError(error);
    }
  }
}
