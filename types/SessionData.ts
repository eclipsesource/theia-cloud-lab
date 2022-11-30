import { V1Volume } from '@kubernetes/client-node';

export type SessionData = {
    app: string;
    hostIP: string | undefined;
    phase: string | undefined;
    podIP: string | undefined;
    qosClass: string | undefined;
    startTime: Date | undefined;
    podName: string | undefined;
    workspaceVolumes: Array<V1Volume> | undefined;
  };
