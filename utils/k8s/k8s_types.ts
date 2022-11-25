export type CustomResourceObj = {
    kind: string;
    apiVersion: string;
    metadata: {
        name: string;
        namespace: string;
    }
    spec: object;
}