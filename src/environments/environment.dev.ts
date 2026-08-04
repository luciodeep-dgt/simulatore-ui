export const environment = {
  production: true,
  locale: 'it',
  session_storage_key: 'user',

  isResourceIncluded: false,

  baseUrl: 'https://dev-simulatore-sispar.cdp.it',
  sispar: 'https://dev-sispar.cdp.it/',
  // ADFS
  adfs: {
    client_id: '79eced68-d152-40f0-b3ad-3e36182fe8ad',
    authorize_endpoint: 'https://login.microsoftonline.com/8c4b47b5-ea35-4370-817f-95066d4f8467/oauth2/v2.0/authorize',
    token_endpoint: 'https://dev-simulatore-sispar.cdp.it/oauth2/token',
    redirect_uri: 'https://dev-simulatore-sispar-ui.cdp.it/auth-callback',
    resource: 'https://dev-simulatore-sispar-ui.cdp.it',
    scope: 'https://dev-simulatore-sispar-ui.cdp.it/.default',
    logout_endpoint: 'https://login.microsoftonline.com/8c4b47b5-ea35-4370-817f-95066d4f8467/oauth2/v2.0/logout',
  },
  ROLE: {
    OPERATORE: 'ad_sispar_simul_userdev',
    VALIDATORE: 'ad_sispar_simul_user_approverdev',
    ADMIN: 'ad_sispar_simul_keyuserdev',
    SUPERADMIN: 'ad_sispar_app_admindev'
  }

};
