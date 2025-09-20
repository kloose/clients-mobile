export const AUTH0_DOMAIN = 'dev-ffuy7gqrimo4flu2.uk.auth0.com';
export const AUTH0_CLIENT_ID = 'oagA9k8icEHEZvRic9mQpQiiPlbydJTI';
export const API_URL = 'http://localhost:8081/api';

export const AUTH0_CONFIG = {
  domain: AUTH0_DOMAIN,
  clientId: AUTH0_CLIENT_ID,
  audience: `https://${AUTH0_DOMAIN}/api/v2/`,
  scope: 'openid profile email offline_access',
};