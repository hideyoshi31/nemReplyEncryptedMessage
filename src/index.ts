import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as nemwrap from './nemWrapper'
admin.initializeApp()

export const transferTransactioneEcryptedMessage = functions.https.onRequest((req, res) => {
  const address: any = req.body.address
  const massege: any = req.body.massege
  return nemwrap.getPublickKey(address)
  .then((resolve:any) => {
    return nemwrap.sendEncryptMessage(resolve,address,massege)
  })
  .then((resolve:any) => {
    const result = resolve
    console.log(result)
    res.send(result)
  })
})