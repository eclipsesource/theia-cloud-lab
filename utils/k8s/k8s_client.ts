import {
  KubeConfig,
  CustomObjectsApi,
  CoreV1Api,
  ApiextensionsV1Api,
  V1CustomResourceDefinitionList,
  V1PersistentVolumeClaim,
  V1PersistentVolume,
} from '@kubernetes/client-node';
import http from 'http';
import { CustomResourceObj } from './k8s_types';

export class KubernetesClient {
  group: string;
  apiVersion: string;
  apiBetaVersion: string;
  namespace: string;
  pluralWS: string;
  pluralSes: string;
  kc: KubeConfig;
  appDef: string;
  apiBetaVersionV2: string;

  constructor() {
    this.group = 'theia.cloud';
    this.apiVersion = 'v1';
    this.apiBetaVersion = 'v1beta';
    this.apiBetaVersionV2 = 'v2beta';
    this.namespace = 'theiacloud';
    this.pluralWS = 'workspaces';
    this.pluralSes = 'sessions';
    this.appDef = 'theia-cloud-demo';
    this.kc = new KubeConfig();
    this.kc.loadFromDefault();
  }

  createCustomObjectsApiClient(): CustomObjectsApi {
    return this.kc.makeApiClient(CustomObjectsApi);
  }

  createCoreV1ApiClient(): CoreV1Api {
    return this.kc.makeApiClient(CoreV1Api);
  }

  createApiextensionsV1ApiClient(): ApiextensionsV1Api {
    return this.kc.makeApiClient(ApiextensionsV1Api);
  }

  async getWorkspaceList(): Promise<any> {
    const customObjectsApi = this.createCustomObjectsApiClient();
    const data = await customObjectsApi.listNamespacedCustomObject(
      this.group,
      this.apiBetaVersion,
      this.namespace,
      this.pluralWS
    );
    return data;
  }

  async getSessionList(): Promise<any> {
    const customObjectsApi = this.createCustomObjectsApiClient();
    const data = await customObjectsApi.listNamespacedCustomObject(
      this.group,
      this.apiBetaVersionV2,
      this.namespace,
      this.pluralSes
    );
    return data;
  }

  async getPersistentVolumeList(): Promise<V1PersistentVolume[]> {
    const coreV1Api = this.createCoreV1ApiClient();
    const data = await coreV1Api.listPersistentVolume();
    return data.body.items;
  }

  async getPersistentVolumeClaimList(): Promise<V1PersistentVolumeClaim[]> {
    const coreV1Api = this.createCoreV1ApiClient();
    const data = await coreV1Api.listNamespacedPersistentVolumeClaim(this.namespace);
    return data.body.items;
  }

  async getNamespacedPodList(): Promise<any> {
    const coreV1Api = this.createCoreV1ApiClient();
    return await coreV1Api.listNamespacedPod(this.namespace);
  }

  async getNamespacedWorkspace(name: string): Promise<any> {
    const customObjectsApi = this.createCustomObjectsApiClient();
    return await customObjectsApi.getNamespacedCustomObject(
      this.group,
      this.apiBetaVersion,
      this.namespace,
      this.pluralWS,
      name
    );
  }

  async getCustomResourceDefinitionList(): Promise<{
    response: http.IncomingMessage;
    body: V1CustomResourceDefinitionList;
  }> {
    const apiExtensionsV1Api = this.createApiextensionsV1ApiClient();
    return await apiExtensionsV1Api.listCustomResourceDefinition();
  }

  async createSession(sessionName: string, workspaceName: string): Promise<any> {
    // create clients
    const customObjectsApi = this.createCustomObjectsApiClient();
    // Session Object
    const toBeCreatedSessionObj: CustomResourceObj = {
      kind: 'Session',
      apiVersion: `${this.group}/${this.apiBetaVersionV2}`,
      metadata: {
        name: `${sessionName}`,
        namespace: this.namespace,
        workspace: workspaceName,
      },
      spec: {
        appDefinition: this.appDef,
        namespace: 'theiacloud',
        name: `${sessionName}`,
        workspace: workspaceName,
      },
    };
    // create session and bind with workspace
    return await customObjectsApi.createNamespacedCustomObject(
      this.group,
      'v2beta',
      this.namespace,
      this.pluralSes,
      toBeCreatedSessionObj
    );
  }

  async deleteSession(name: string): Promise<any> {
    const customObjectsApi = this.createCustomObjectsApiClient();
    return await customObjectsApi.deleteNamespacedCustomObject(
      this.group,
      this.apiBetaVersion,
      this.namespace,
      this.pluralSes,
      name
    );
  }
}
