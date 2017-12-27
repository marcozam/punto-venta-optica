// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  webServiceURL: 'http://localhost:54549/api/General/GetData',
  DBID: '',
  defaultUser: 1,
  firebase: {
    apiKey: "AIzaSyAaYitaw5qGqLJ21pQtrtIontuJ-OlUD2w",
    authDomain: "sios-af5a2.firebaseapp.com",
    databaseURL: "https://sios-af5a2.firebaseio.com",
    projectId: "sios-af5a2",
    storageBucket: "sios-af5a2.appspot.com",
    messagingSenderId: "798968163214",
  }
};