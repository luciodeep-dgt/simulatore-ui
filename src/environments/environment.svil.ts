export const environment = {
  production: false,
  locale: 'it',
  session_storage_key: 'user',

  isResourceIncluded: true,

  baseUrl: 'http://10.206.199.234:8080/simulatore',
  sispar: 'https://dev-sispar.cdp.it/',
  // ADFS
  adfs: {
    client_id: 'c5a70ecab9ad49b491fed3c385002cah',
    authorize_endpoint: 'http://10.206.199.234:8080/adfs/oauth2/authorize',
    token_endpoint: 'http://10.206.199.234:8080/adfs/oauth2/token',
    redirect_uri: 'http://127.0.0.1:4200/',
    resource: 'http://127.0.0.1:4200/',
    logout_endpoint: 'https://accesso.cdp.it/adfs/oauth2/logout'
  },
  ROLE: {
    OPERATORE: 'ad_sispar_simul_userdev',
    VALIDATORE: 'ad_sispar_simul_user_approverdev',
    ADMIN: 'ad_sispar_simul_keyuserdev',
    SUPERADMIN: 'ad_sispar_admindev'
  },

};
