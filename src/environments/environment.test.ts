export const environment = {
  production: true,
  locale: 'it',
  session_storage_key: 'user',

  isResourceIncluded: false,

  baseUrl: 'https://test-simulatore-sispar.cdp.it',
  sispar: 'https://test-sispar.cdp.it/',
  // ADFS
  adfs: {
    client_id: 'e1915834-0e2e-4d88-8903-49fc147c9117',
    authorize_endpoint: 'https://accesso.cdp.it/adfs/oauth2/authorize',
    token_endpoint: 'https://test-simulatore-sispar.cdp.it/oauth2/token',
    redirect_uri: 'https://test-simulatore-sispar-ui.cdp.it/auth-callback',
    resource: 'https://test-simulatore-sispar-ui.cdp.it',
    logout_endpoint: 'https://accesso.cdp.it/adfs/oauth2/logout'
  },
  ROLE: {
    OPERATORE: 'ad_sispar_simul_usert',
    VALIDATORE: 'ad_sispar_simul_user_approvert',
    ADMIN: 'ad_sispar_simul_keyusert',
    SUPERADMIN: 'ad_sispar_app_admint'
  },

};
