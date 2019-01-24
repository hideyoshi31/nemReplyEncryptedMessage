import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as nemwrap from './nemWrapper.1'
admin.initializeApp()

export const transferTransactioneEcryptedMessage = functions.https.onRequest((req, res) => {
  const address: any = req.body.address
  return nemwrap.getPublickKey(address)
  .then(nemwrap.sendMessage)
  .then((resolve) => {
    const result = resolve
    console.log(result)
    res.send(result)
  })
})