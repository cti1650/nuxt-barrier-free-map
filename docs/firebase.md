1. Firebase プロジェクトの作成
   - Firebase Console (https://console.firebase.google.com/) にアクセス
   - "プロジェクトを追加" をクリック
   - プロジェクト名を入力し、必要に応じて Google Analytics を有効化
   - "プロジェクトを作成" をクリック

2. Firestore データベースの設定
   - 左側のメニューから "Firestore Database" を選択
   - "データベースの作成" をクリック
   - セキュリティルールを選択（開発時は "テストモードで開始" を選択可）
   - リージョンを選択し、"有効にする" をクリック

3. Webアプリケーションの登録
   - プロジェクトの概要ページで "</>" アイコンをクリック
   - アプリのニックネームを入力し、"アプリを登録" をクリック
   - 表示される設定情報をメモ（これが .env ファイルに入力する情報です）

4. Firebase Authentication の設定 (オプション)
   - 左側のメニューから "Authentication" を選択
   - "始める" をクリック
   - 必要な認証方法（例：メール/パスワード、Google）を有効化

5. セキュリティルールの設定
   - 左側のメニューから "Firestore Database" を選択
   - "ルール" タブをクリック
   - 以下のような基本的なルールを設定（開発時のみ）:

     ```
     rules_version = '2';
     service cloud.firestore {
       match /databases/{database}/documents {
         match /{document=**} {
           allow read, write: if true;
         }
       }
     }
     ```

   注意: 本番環境ではより厳密なセキュリティルールを設定してください。

6. Firebase SDK の初期化（既に完了済み）
   - プロジェクトの設定情報を使用して Firebase SDK を初期化
   （これは既に `plugins/firebase.ts` で実装済みです）

7. Firebase CLI のインストール (オプション、ローカル開発用)
   - `npm install -g firebase-tools` を実行
   - `firebase login` でCLIにログイン
   - プロジェクトディレクトリで `firebase init` を実行し、必要なサービスを選択