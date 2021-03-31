// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'AIzaSyBhTVpXzNvKMSNilrtiIKE66K8ZdYDaxyg',
    authDomain: 'gotacar.firebaseapp.com',
    projectId: 'gotacar',
    storageBucket: 'gotacar.appspot.com',
    messagingSenderId: '856766194920',
    appId: '1:856766194920:web:84c7ba1775627a6432155d',
    measurementId: 'G-4CFNZXY3HZ',
  },
  geocoding_api_key: 'AIzaSyBkp6HzeX3-Rc38pI1ljbvrmSmrZgJ2OAU',
  api_url: 'http://localhost:8081',
  stripe_api_key: 'pk_test_51I0FjpJ65m70MT01jLdRMb5KR6blj6ifmQuK2DvQq8f1SbQOZsKgdRLI6Zk7rj518pn5Ccl9kR6QGrB1WxEF1s9e00gzgwrpdM'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
