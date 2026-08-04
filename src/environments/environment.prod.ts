export const environment = {
  production: true,
  locale: 'it',
  session_storage_key: 'user',

  isResourceIncluded: false,

  baseUrl: 'https://simulatore-sispar.cdp.it',
  sispar: 'https://sispar.cdp.it/',
  // ADFS
  adfs: {
    client_id: 'c88436f8-053e-4916-b52e-50c24782c220',
    authorize_endpoint: 'https://accesso.cdp.it/adfs/oauth2/authorize',
    token_endpoint: 'https://simulatore-sispar.cdp.it/oauth2/token',
    redirect_uri: 'https://simulatore-sispar-ui.cdp.it/auth-callback',
    resource: 'https://simulatore-sispar-ui.cdp.it',
    logout_endpoint: 'https://accesso.cdp.it/adfs/oauth2/logout'
  },
  ROLE: {
    OPERATORE: 'ad_sispar_simul_user',
    VALIDATORE: 'ad_sispar_simul_user_approver',
    ADMIN: 'ad_sispar_simul_keyuser',
    SUPERADMIN: 'ad_sispar_app_admin'
  },

};
