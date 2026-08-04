export const environment = {
  production: true,
  locale: 'it',
  session_storage_key: 'user',

  isResourceIncluded: false,

  baseUrl: 'https://dev-simulatore-sispar.cdp.it',
  sispar: 'https://dev-simulatore-sispar-ui.cdp.it',
  // ADFS
  adfs: {
    client_id: 'c5a70ecab9ad49b491fed3c385002cah',
    authorize_endpoint: 'https://accesso.cdp.it/adfs/oauth2/authorize',
    token_endpoint: 'https://dev-simulatore-sispar.cdp.it/oauth2/token',
    redirect_uri: 'https://dev-simulatore-sispar-ui.cdp.it/auth-callback',
    resource: 'https://dev-simulatore-sispar-ui.cdp.it',
    logout_endpoint: 'https://accesso.cdp.it/adfs/oauth2/logout'
  },
  ROLE: {
    OPERATORE: 'ad_sispar_simul_userdev',
    VALIDATORE: 'ad_sispar_simul_user_approverdev',
    ADMIN: 'ad_sispar_simul_keyuserdev',
    SUPERADMIN: 'ad_sispar_admindev'
  },
  
};