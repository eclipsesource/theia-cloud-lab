import {
  KubeConfig,
  CustomObjectsApi,
  CoreV1Api,
  ApiextensionsV1Api,
  V1CustomResourceDefinitionList,
  V1PersistentVolumeClaim,
  V1PersistentVolume,
  Metrics,
} from '@kubernetes/client-node';
import http from 'http';
import { CustomResourceObj } from './k8s_types';
import wsHostConfig from '../../configs/ws_config';

export class KubernetesClient {
  group: string;
  apiVersion: string;
  apiBetaVersion: string;
  namespace: string;
  pluralWS: string;
  pluralAD: string;
  pluralSes: string;
  kc: KubeConfig;
  // appDef: string;
  apiBetaVersionV2: string;
  apiBetaVersionV3: string;

  constructor() {
    this.group = 'theia.cloud';
    this.apiVersion = 'v1';
    this.apiBetaVersion = 'v1beta';
    this.apiBetaVersionV2 = 'v2beta';
    this.apiBetaVersionV3 = 'v3beta';
    this.namespace = 'theiacloud';
    this.pluralWS = 'workspaces';
    this.pluralAD = 'appdefinitions';
    this.pluralSes = 'sessions';
    // this.appDef = 'theia-cloud-demo';
    // this.appDef = 'coffee-editor'; // this part will be changed
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

  createMetricsApiClient(): Metrics {
    return new Metrics(this.kc);
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

  async getAppDefinitionsList(): Promise<any> {
    const customObjectsApi = this.createCustomObjectsApiClient();
    const data = await customObjectsApi.listNamespacedCustomObject(
      this.group,
      this.apiBetaVersionV3,
      this.namespace,
      this.pluralAD
    );
    return data;
  }

  async getPodMetrics(): Promise<any> {
    const metricsClient = this.createMetricsApiClient();
    const data = metricsClient.getPodMetrics(this.namespace);
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

  // async createWorkspaceAndPersistentVolume(name: string): Promise<any> {
  //   // create clients
  //   const customObjectsApi = this.createCustomObjectsApiClient();
  //   const coreV1Api = this.createCoreV1ApiClient();

  //   // Persistent Volume Claim Object
  //   const toBeCreatedPersistentVolumeClaimObj: CustomResourceObj = {
  //     kind: 'PersistentVolumeClaim',
  //     apiVersion: this.apiVersion,
  //     metadata: {
  //       name: `storage-${name}`,
  //       namespace: this.namespace,
  //     },
  //     spec: {
  //       resources: {
  //         requests: {
  //           storage: this.storage,
  //         },
  //       },
  //       accessModes: this.accessModes,
  //     },
  //   };

  //   // Workspace Object
  //   const toBeCreatedWorkspaceObj: CustomResourceObj = {
  //     kind: 'Workspace',
  //     apiVersion: `${this.group}/${this.apiBetaVersion}`,
  //     metadata: {
  //       name: `ws-${name}`,
  //       namespace: this.namespace,
  //     },
  //     spec: {
  //       storage: toBeCreatedPersistentVolumeClaimObj.metadata.name,
  //       appDefinition: this.appDef,
  //       label: `theia-cloud-demo of ${name}`,
  //     },
  //   };

  //   // create Persistent Volume Claim
  //   await coreV1Api.createNamespacedPersistentVolumeClaim(this.namespace, toBeCreatedPersistentVolumeClaimObj);
  //   // create Workspace and bind with volume
  //   return await customObjectsApi.createNamespacedCustomObject(
  //     this.group,
  //     this.apiBetaVersion,
  //     this.namespace,
  //     this.pluralWS,
  //     toBeCreatedWorkspaceObj
  //   );
  // }

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

  // in the ticket it is suggest to read this fields from a document
  async createAppDefinition(appDefName: string, image: string): Promise<any> {
    // create clients
    const customObjectsApi = this.createCustomObjectsApiClient();
    // App Definition Object
    const toBeCreatedAppDefObj: CustomResourceObj = {
      kind: 'AppDefinition',
      apiVersion: `${this.group}/${this.apiBetaVersionV3}`,
      metadata: {
        name: `${appDefName}`, // 'coffee-editor'
        namespace: this.namespace,
      },
      spec: {
        name: 'cdt-cloud-demo', // will be changed, this part im confused how to config
        host: wsHostConfig.hostUrl,
        image: `${image}`, // 'eu.gcr.io/kubernetes-238012/coffee-editor:v0.7.14',
        ingressname: 'theia-cloud-demo-ws-ingress', // will be changed, this part im confused how to config
        limitsMemory: '1200M',
        limitsCpu: '2',
        port: 3000,
        requestsCpu: '100m',
        requestsMemory: '1000M',
        maxInstances: 10,
        minInstances: 0,
        mountPath: '/home/project/persisted',
        uplinkLimit: 30000,
        timeout: {
          limit: 30,
          strategy: 'FIXEDTIME',
        },
      },
    };
    // create app definition
    return await customObjectsApi.createNamespacedCustomObject(
      this.group,
      `${this.apiBetaVersionV3}`,
      this.namespace,
      this.pluralAD,
      toBeCreatedAppDefObj
    );
  }

  // in the ticket it is suggest to read this fields from a document???
  async editAppDefinition(
    appDefName: string,
    image: string,
    port: number,
    requestsCPU: string,
    requestsMemory: string,
    limitsMemory: string,
    limitsCpu: string,
    timeout: number
    // ingressname: string, ?
  ): Promise<any> {
    // create clients
    const customObjectsApi = this.createCustomObjectsApiClient();
    // find the app def CR to be edited
    // DO I EVEN NEED TO FIND IT THEN??? THIS CAN BE REMOVED
    const objToFound: any = await customObjectsApi.getNamespacedCustomObject(
      this.group,
      `${this.apiBetaVersionV3}`,
      this.namespace,
      this.pluralAD,
      appDefName
    );
    const newBody = objToFound.body;
    newBody.spec.image = image;
    newBody.spec.port = port;
    newBody.spec.requestsCPU = requestsCPU;
    newBody.spec.requestsMemory = requestsMemory;
    newBody.spec.limitsMemory = limitsMemory;
    newBody.spec.limitsCpu = limitsCpu;
    newBody.spec.timeout.limit = timeout;

    const options = { headers: { 'Content-type': 'application/merge-patch+json' } };
    // edit the cr
    return await customObjectsApi.patchNamespacedCustomObject(
      this.group,
      `${this.apiBetaVersionV3}`,
      this.namespace,
      this.pluralAD,
      appDefName,
      newBody,
      undefined,
      undefined,
      undefined,
      options
    );
  }

  async createSession(sessionName: string, workspaceName: string, appDefinition: string): Promise<any> {
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
        appDefinition: appDefinition,
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

  async deleteAppDefinition(name: string): Promise<any> {
    const customObjectsApi = this.createCustomObjectsApiClient();
    return await customObjectsApi.deleteNamespacedCustomObject(
      this.group,
      this.apiBetaVersionV3,
      this.namespace,
      this.pluralAD,
      name
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
