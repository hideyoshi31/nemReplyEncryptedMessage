import * as admin from 'firebase-admin'
import * as nemwrap from './nemWrapper'
admin.initializeApp()

/*
function transferTransactioneEcryptedMessage(addr:any, ms:any){
  const address: any = addr
  const message: any = ms
  return nemwrap.getPublickKey(address)
  .then((resolve:any) => {
    return nemwrap.sendEncryptMessage(resolve,address,message)
  })
  .then((resolve:any) => {
    const result = resolve
    console.log(result)
  })
}
*/
function transactioneCheck(addr:any){
  const address: any = addr
  return nemwrap.getTransaction(address)
  .then((resolve:any) => {
    const result = resolve
    result.forEach((item: any, i: any) => {
      if(item._xem.amount > 0){
        const x = i + ":" + item.signer.address.value + ":" + item._xem.amount
        console.log(x)
      }
    })
  })
}
transactioneCheck("NDSMFD5OB6AKPUEL4EO3CQXS7EXMSMPJOUDNZVZS")