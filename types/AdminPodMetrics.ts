import { ContainerMetric } from '@kubernetes/client-node';

export type AdminPodMetrics = {
  metadata: {
    name: string;
    namespace: string;
    selfLink: string;
    creationTimestamp: string;
    labels: {
      [key: string]: string;
    };
  };
  timestamp: string;
  window: string;
  containers: ContainerMetric[];
};
