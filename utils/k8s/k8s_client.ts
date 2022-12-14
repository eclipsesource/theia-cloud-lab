import {
  KubeConfig,
  CustomObjectsApi,
  CoreV1Api,
  ApiextensionsV1Api,
  V1CustomResourceDefinitionList,
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
  storage: string;
  accessModes: [string];
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
    this.storage = '250Mi';
    this.accessModes = ['ReadWriteOnce'];
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

  async getPersistentVolumeList(): Promise<any> {
    const coreV1Api = this.createCoreV1ApiClient();
    return await coreV1Api.listPersistentVolume(this.namespace);
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

  async createWorkspaceAndPersistentVolume(name: string): Promise<any> {
    // create clients
    const customObjectsApi = this.createCustomObjectsApiClient();
    const coreV1Api = this.createCoreV1ApiClient();

    // Persistent Volume Claim Object
    const toBeCreatedPersistentVolumeClaimObj: CustomResourceObj = {
      kind: 'PersistentVolumeClaim',
      apiVersion: this.apiVersion,
      metadata: {
        name: `storage-${name}`,
        namespace: this.namespace,
      },
      spec: {
        resources: {
          requests: {
            storage: this.storage,
          },
        },
        accessModes: this.accessModes,
      },
    };

    // Workspace Object
    const toBeCreatedWorkspaceObj: CustomResourceObj = {
      kind: 'Workspace',
      apiVersion: `${this.group}/${this.apiBetaVersion}`,
      metadata: {
        name: `ws-${name}`,
        namespace: this.namespace,
      },
      spec: {
        storage: toBeCreatedPersistentVolumeClaimObj.metadata.name,
        appDefinition: this.appDef,
        label: `theia-cloud-demo of ${name}`,
      },
    };

    // create Persistent Volume Claim
    await coreV1Api.createNamespacedPersistentVolumeClaim(this.namespace, toBeCreatedPersistentVolumeClaimObj);
    // create Workspace and bind with volume
    return await customObjectsApi.createNamespacedCustomObject(
      this.group,
      this.apiBetaVersion,
      this.namespace,
      this.pluralWS,
      toBeCreatedWorkspaceObj
    );
  }

  async deleteWorkspace(name: string): Promise<any> {
    // retrieve the obj to get information for PVC
    const toBeDeletedWS = await this.getNamespacedWorkspace(name);

    // Actually delete the WS obj
    const customObjectsApi = this.createCustomObjectsApiClient();
    const coreV1Api = this.createCoreV1ApiClient();

    const a = await customObjectsApi.deleteNamespacedCustomObject(
      this.group,
      this.apiBetaVersion,
      this.namespace,
      this.pluralWS,
      name
    );

    // delete the PVC binded to the workspace
    return await coreV1Api.deleteNamespacedPersistentVolumeClaim(toBeDeletedWS.body.spec.storage, this.namespace);
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
