import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'
import * as nemwrap from './nemWrapper'
admin.initializeApp()

const ADRESS = "NAAQFW757GUXMEPZQKPZQCUQCS63G4GQYZ4NSDSK"
const BORDER_AMOUNT = 0.1
const SEND_MESSAGE = "ango"

/*
nemwrap.incomingTransactions(ADRESS)
  .then((resolve:any) => {
    let aaa:any[] =[]
    const result = resolve
    result.forEach((item:any) => {
      let bbb = item.message
      aaa.push(bbb)
    })
  })
*/

export const nemReplyEncryptedMessage = functions.https.onRequest((req, res) => {
return nemwrap.getIncomingTransactions(ADRESS)
  .then((resolve:any) => {
    const result = resolve
    const addresses: any[]=[]    
    result.forEach((item: any, i: any) => {
      if(item._xem.amount >= BORDER_AMOUNT){
        const address: any = {
          address: item.signer.address.value,
        }
        addresses.push(address)
      }
    })
    return addresses
  })
  .then((resolve:any) => {
    const targetaddr: any = resolve
    return nemwrap.getOutgoingTransactions(ADRESS)
    .then((outgoingTransactions:any) => {
      const sendedaddr = outgoingTransactions
      const sendedaddres :any[] =[]
      sendedaddr.forEach((item: any) => {
          const address: any = {
            address: item.recipient.value,
          }
          sendedaddres.push(address)
      })
      let sendaddr: any[] = []
      let counter: number =0
      for(let i = 0; i < targetaddr.length; i++){
        for(let j = 0; j<sendedaddres.length; j++){
          if(counter==0 && targetaddr[i].address == sendedaddres[j].address){
            counter++
          }
        }
        if(counter==0){
          console.log(targetaddr[i].address,i)
          sendaddr.push(targetaddr[i])
        }
        counter = 0
      }
      let arrObj: any = {};
      for (let i = 0; i < sendaddr.length; i++) {
        arrObj[sendaddr[i]['address']] = sendaddr[i];
      }
      
      sendaddr = [];
      for (let key in arrObj) {
        sendaddr.push(arrObj[key]);
      }
      const sendeddress: any[]=[]
      sendaddr.forEach((item:any) => {
        const address: any = {
          address: item.address,
        }
        sendeddress.push(address)
      })
      /*
      return nemwrap.getUnconfirmedTransactions(ADRESS)
      .then((resolve:any) => {
        let sendeddress: any[]=[]
        if(resolve.length==0){
          outgoingaddress.forEach((item:any) => {
            const address: any = {
              address: item.address
            }
            sendeddress.push(address)
          })
        }else{
          const result = resolve
          let addresses: any[]=[]
          result.forEach((i: any) => {
            const address: any = {
              address: result[i].recipient.value,
            }
            addresses.push(address)
          })
          for(var i=0;i<resolve.length;i++){
            for(var j=0;i<outgoingaddress.length;j++){
              if(outgoingaddress[j].address !== addresses[i].address){
                sendeddress = outgoingaddress[j].address
              }
            }
          }
        }
        console.log(sendeddress)
        return sendeddress
      })
      */
      sendeddress.forEach((address:any) => {
        return nemwrap.getPublickKey(address.address)
        .then((publickKey:any) => {
          return nemwrap.sendEncryptMessage(publickKey,address.address,SEND_MESSAGE)
        })
        .then((end:any) => {
          console.log(end)
        })
      })
    })
  })
})