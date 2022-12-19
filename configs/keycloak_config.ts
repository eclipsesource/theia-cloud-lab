const keycloakConfig = {
  keycloakAuthUrl: `https://keycloak.${process.env.NEXT_PUBLIC_MINIKUBE_IP}.nip.io/auth/`,
  keycloakRealm: 'TheiaCloud',
  keycloakClientId: 'theia-cloud',
};

export default keycloakConfig;
