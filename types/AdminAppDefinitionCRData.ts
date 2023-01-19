export type AdminAppDefinitionCRData = {
  name: string;
  image: string;
  port: number;
  requestsCpu: string;
  requestsMemory: string;
  limitsMemory: string;
  limitsCpu: string;
  timeout: number;
  maxInstances: string;
  minInstances: string;
};
