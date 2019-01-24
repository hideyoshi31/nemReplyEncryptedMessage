import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as nemwrap from './nemWrapper'
admin.initializeApp()

export const transferTransactioneEcryptedMessage = functions.https.onRequest((req, res) => {
  const address: any = req.body.address
  const message: any = req.body.message
  return nemwrap.getPublickKey(address)
  .then((resolve:any) => {
    console.log(resolve)
    return nemwrap.sendEncryptMessage(resolve,address,message)
  })
  .then((resolve:any) => {
    const result = resolve
    res.send(result)
  })
})