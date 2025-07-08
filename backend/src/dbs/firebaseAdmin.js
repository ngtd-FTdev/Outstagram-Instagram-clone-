import admin from 'firebase-admin'
import serviceAccount from '../../../api_key/outstagram-db-chat-firebase-adminsdk-fbsvc-a2653e474c.json'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://outstagram-db-chat-default-rtdb.asia-southeast1.firebasedatabase.app"
})

export default admin;
