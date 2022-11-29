import { KubeConfig, CustomObjectsApi, CoreV1Api } from '@kubernetes/client-node';
import { CustomResourceObj } from './k8s_types';

export class KubernetesClient {

    group: string;
    apiVersion: string;
    apiBetaVersion: string;
    namespace: string;
    plural: string;
    storage: string;
    accessModes: [string];
    kc: KubeConfig;
    appDef: string;

    constructor() {
        this.group = 'theia.cloud';
        this.apiVersion = 'v1';
        this.apiBetaVersion = 'v1beta';
        this.namespace = 'theiacloud';
        this.plural = 'workspaces';
        this.storage = '250Mi'
        this.accessModes = ['ReadWriteOnce']
        this.appDef = 'theia-cloud-demo'
        this.kc = new KubeConfig();
        this.kc.loadFromDefault();
    }

    createCustomObjectsApiClient(): CustomObjectsApi {
        return this.kc.makeApiClient(CustomObjectsApi);
    }

    createCoreV1ApiClient(): CoreV1Api {
        return this.kc.makeApiClient(CoreV1Api);
    }

    async getWorkspaceList(): Promise<any> {
        const customObjectsApi = this.createCustomObjectsApiClient();
        const data = await customObjectsApi.listNamespacedCustomObject(this.group, this.apiBetaVersion, this.namespace, this.plural);
        return data;
    }

    async getPersistentVolumeList(): Promise<any> {
        const coreV1Api = this.createCoreV1ApiClient();
        return await coreV1Api.listPersistentVolume(this.namespace);
    }

    async createWorkspaceAndPersistentVolume(name: string): Promise<any> {
        // create clients
        const customObjectsApi = this.createCustomObjectsApiClient();
        const coreV1Api = this.createCoreV1ApiClient();

        // Persistent Volume Claim Object
        const toBeCreatedPersistentVolumeClaimObj: CustomResourceObj = {
            'kind': 'PersistentVolumeClaim',
            'apiVersion': this.apiVersion,
            'metadata': {
                'name': `storage-${name}`,
                'namespace': this.namespace
            },
            'spec': {
                'resources': {
                    'requests': {
                        'storage': this.storage
                    }
                },
                'accessModes': this.accessModes
            }
        };

        // Workspace Object
        const toBeCreatedWorkspaceObj: CustomResourceObj = {
            'kind': 'Workspace',
            'apiVersion': `${this.group}/${this.apiBetaVersion}`,
            'metadata': {
                'name': `ws-${name}`,
                'namespace': this.namespace
            },
            'spec': {
                'storage': toBeCreatedPersistentVolumeClaimObj.metadata.name,
                'appDefinition': this.appDef,
                'label': `theia-cloud-demo of ${name}`
            }
        };

        // create Persistent Volume Claim
        await coreV1Api.createNamespacedPersistentVolumeClaim(this.namespace, toBeCreatedPersistentVolumeClaimObj);
        // create Workspace and bind with volume
        return await customObjectsApi.createNamespacedCustomObject(this.group, this.apiBetaVersion, this.namespace, this.plural, toBeCreatedWorkspaceObj);
    }

    async deleteWorkspace(name: string): Promise<any> {
        const customObjectsApi = this.createCustomObjectsApiClient();
        return await customObjectsApi.deleteNamespacedCustomObject(this.group, this.apiBetaVersion, this.namespace, this.plural, name);
    }
}