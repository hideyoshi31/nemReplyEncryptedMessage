import {
  Account, AccountHttp, NEMLibrary, NetworkTypes, Address, TimeWindow, XEM,
TransactionHttp, TransferTransaction, PublicAccount} from 'nem-library'
NEMLibrary.bootstrap(NetworkTypes.MAIN_NET)

const PASSWORD = 'test'
const PUBLICK_KEY = '2eb08ae3fb38b258d5484b1ba938ae693d3218c052b6c6d10fe62fa6e3b5f0d1'
const PRIVATE_KEY = 'bf6ebaacf25aae42e74d0e438249ee9df3f558c745cb08724c64ba35f2415e64'
const NEM_UNIT = 1000000

exports.PUBLICK_KEY = PUBLICK_KEY
exports.PRIVATE_KEY = PRIVATE_KEY
exports.NEM_UNIT = NEM_UNIT
exports.PASSWORD = PASSWORD

const nodes: any = [
  {protocol: 'https', domain: 'aqualife2.supernode.me', port: 7891},
  {protocol: 'https', domain: 'aqualife3.supernode.me', port: 7891},
  // {protocol: 'https', domain: 'beny.supernode.me', port: 7891}, 調子悪い？
  {protocol: 'https', domain: 'happy.supernode.me', port: 7891},
  {protocol: 'https', domain: 'mnbhsgwbeta.supernode.me', port: 7891},
  // {protocol: 'https', domain: 'nemstrunk.supernode.me', port: 7891}, 調子悪い？
  // {protocol: 'https', domain: 'nemstrunk2.supernode.me', port: 7891}, 調子悪い？
  {protocol: 'https', domain: 'nsm.supernode.me', port: 7891},
  {protocol: 'https', domain: 'kohkei.supernode.me', port: 7891},
  {protocol: 'https', domain: 'mttsukuba.supernode.me', port: 7891},
  {protocol: 'https', domain: 'strategic-trader-1.supernode.me', port: 7891},
  {protocol: 'https', domain: 'strategic-trader-2.supernode.me', port: 7891},
  {protocol: 'https', domain: 'shibuya.supernode.me', port: 7891},
  {protocol: 'https', domain: 'qora01.supernode.me', port: 7891},
  {protocol: 'https', domain: 'pegatennnag.supernode.me', port: 7891}
]

// Using custom NIS Node
const accountHttp = new AccountHttp(nodes)
const transactionHttp = new TransactionHttp(nodes)

export function sendEncryptMessage (pbkey:any, addr:any, ms: any) {
const amount: number = 0
const publickkey = pbkey
const address = addr
const privateKey = PRIVATE_KEY
const message = ms

const promise = new Promise((resolve, reject) => {
  const account = Account.createWithPrivateKey(privateKey)
  const recipientPublicAccount = PublicAccount.createWithPublicKey(publickkey);
  const encryptedMessage = account.encryptMessage(message, recipientPublicAccount);
  const tx = TransferTransaction.create(
    TimeWindow.createWithDeadline(),
    new Address(address),
    new XEM(amount),
    encryptedMessage
  )
  const signedTransaction = account.signTransaction(tx)
  transactionHttp.announceTransaction(signedTransaction).subscribe(
    result => { resolve(result) },
    error => { reject(error) }
  )
})
return promise
}

export function getPublickKey(addr:any) {
const promise =  new Promise((resolve, reject) => {
  const address = new Address(addr)
  accountHttp.getFromAddress(address).subscribe(
    accountInfoWithMetaData => { resolve([accountInfoWithMetaData.publicAccount.publicKey,addr]) },
    error => { reject(error) }
  )
})
return promise
}
