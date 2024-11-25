import { create } from 'ipfs-http-client'

const PROJECT_ID = '2ELu077yKddrWgBs68EgqeW73rt'
const PROJECT_SECRET = 'b31c14879618d557cf903a4353f147e3'

export const getClient = () => {
  return create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: 'Basic ' + btoa(PROJECT_ID + ':' + PROJECT_SECRET)
    }
  })
}
