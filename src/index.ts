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
export const nemReplyEncryptedMessage = functions.https.onRequest(async(req, res) => {
  try {
    //入金履歴
    const r1:any = await nemwrap.getIncomingTransactions(ADRESS)
    //一定以上のXEM入金リスト
    const r2:any = r1.filter((item:any) => item._xem.amount >= BORDER_AMOUNT)
    //出金履歴
    const r3:any = await nemwrap.getOutgoingTransactions(ADRESS)
    //未承認トランザクション
    /*const r4:any = await nemwrap.getUnconfirmedTransactions(ADRESS)
    //3と4の連結
    const r5 = Object.assign(r3, r4)*/
    //入金済みかつ未送信アドレス抽出
    const r6: any[] = []
    let counter: number =0
    for(let i = 0; i < r2.length; i++){
      for(let j = 0; j<r3.length; j++){
        if(counter===0 && r2[i].signer.address.value === r3[j].recipient.value){
          counter++
        }
      }
      if(counter===0){
        r6.push(r2[i].signer.address.value)
      }
      counter = 0
    }
    //重複削除
    const r7 = r6.filter((x:any, i, self) => self.indexOf(x) === i)

    r7.forEach(async(address:any) => {
      //公開鍵取得
      const pbkey = await nemwrap.getPublickKey(address)
      console.log(address)
      //メッセージ送信
      const result = await nemwrap.sendEncryptMessage(pbkey,address,SEND_MESSAGE)
      console.log(result)
    })
  }catch(error) {
    console.error(error)
  }
  res.send("OK")
})