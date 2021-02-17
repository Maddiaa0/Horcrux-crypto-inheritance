// // Core interfaces
// import { createAgent, IDIDManager, IResolver, IDataStore, IKeyManager } from '@veramo/core'

// // // Core identity manager plugin
// // import { DIDManager } from '@veramo/did-manager'

// // // Ethr did identity provider
// // import { EthrDIDProvider } from '@veramo/did-provider-ethr'

// // // Web did identity provider
// // import { WebDIDProvider } from '@veramo/did-provider-web'

// // // Core key manager plugin
// // import { KeyManager } from '@veramo/key-manager'

// // // Custom key management system for RN
// // import { KeyManagementSystem } from '@veramo/kms-local'

// // Custom resolvers
// // import { DIDResolverPlugin } from '@veramo/did-resolver'
// // import { Resolver } from 'did-resolver'
// // import { getResolver as ethrDidResolver } from 'ethr-did-resolver'
// // import { getResolver as webDidResolver } from 'web-did-resolver'

// // Storage plugin using TypeOrm
// import { Entities, KeyStore, DIDStore, IDataStoreORM } from '@veramo/data-store'

// // TypeORM is installed with daf-typeorm
// import { createConnection } from 'typeorm'

// // This will be the name for the local sqlite database for demo purposes
// const DATABASE_FILE = 'database.sqlite'

// // You will need to get a project ID from infura https://www.infura.io
// const INFURA_PROJECT_ID = 'bd43a2a9349a4c05af34e872b1872563'

// const dbConnection = createConnection({
//     type: 'sqlite',
//     database: DATABASE_FILE,
//     synchronize: true,
//     logging: ['error', 'info', 'warn'],
//     entities: Entities,
//   })

  
// export const agent = createAgent({
//     plugins: [
//         // new KeyManager({
//         // store: new KeyStore(dbConnection),
//         // kms: {
//         //     local: new KeyManagementSystem(),
//         // },
//         // }),
//         // new DIDManager({
//         // store: new DIDStore(dbConnection),
//         // defaultProvider: 'did:ethr:rinkeby',
//         // providers: {
//         //     'did:ethr:kovan': new EthrDIDProvider({
//         //         defaultKms: 'local',
//         //         network: 'rinkeby',
//         //         rpcUrl: 'https://kovan.infura.io/v3/' + INFURA_PROJECT_ID,
//         //     }),
//         // },
//         // }),
//         new DIDResolverPlugin({
//         resolver: new Resolver({
//             ethr: ethrDidResolver({
//             networks: [{ name: 'rinkeby', rpcUrl: 'https://rinkeby.infura.io/v3/' + INFURA_PROJECT_ID }],
//             }).ethr,
//             web: webDidResolver().web,
//         }),
//         }),
//     ],
// })