'use strict'
//API URLリスト
const urlSignUpAPI = 'https://teachapi.herokuapp.com/sign_up';
const urlSignInAPI = 'https://teachapi.herokuapp.com/sign_in';
const urlUserAPI = 'https://teachapi.herokuapp.com/users';
const urlTimeLineAPI = 'https://teachapi.herokuapp.com/posts/';
const urlChatRoomAPI = 'https://teachapi.herokuapp.com/chatrooms';

//html URLリスト
const urlSignIn= 'signIn.html'; 
const urlUserHtml = 'user.html' ;
const urlMyPage = 'myPage.html';
const urlPostEdit = 'postEdit.html';
const urlMyPost = 'myPost.html';
const urlEntryChatRoom = 'entryChatRoom.html';

const userList = document.getElementById('userList');
const postList = document.getElementById('postList');
const myPostList = document.getElementById('myPostList');
const myFollowList = document.getElementById('myFollowList');
const myFollowersList = document.getElementById('myFollowersList');
const chatRoomList = document.getElementById('chatRoomList');
const messageList = document.getElementById('messageList');
const myName = document.getElementById('myName');
const myId = document.getElementById('myId');
const myBio = document.getElementById('myBio');

//ローカルストレージのリセット
const removeItem = (key) => {         
  window.localStorage.removeItem(key);
}
const localReset = () => {
  removeItem('token');
  removeItem('id');
  removeItem('bio');
  removeItem('name');
  removeItem('postId');
  removeItem('text');
}
//ローカルストレージから値を取り出す
const getToken = 'Bearer '+ window.localStorage.getItem('token'); 
const getId = window.localStorage.getItem('id');
const getPostId = window.localStorage.getItem('postId');
const getChatRoomId = window.localStorage.getItem('chatRoomId');
//ページ移動
const move = (url) => {
  location.href = url ;
}
//ログアウト
const signOut = () => {
  localReset();
  move(urlSignIn);
}
//httpに使用するHeadersオブジェクトの生成
let myHeaders = new Headers();
myHeaders.append(
  'Content-Type','application/json'
)
let myTokenHeaders = {
  'Content-Type': 'application/json',
  'Authorization': getToken
}
//アカウント登録
const signUp = () => {
  localReset();
  const name = document.getElementById('signUpName').value;
  const bio = document.getElementById('signUpBio').value;
  const email = document.getElementById('signUpEmail').value;
  const password = document.getElementById('signUpPassword').value;
  const password_confirmation = document.getElementById('signUpPassword_confirmation').value;
  const sign_up_params = {
    "sign_up_user_params": {
      "name": name,
      "bio": bio,
      "email": email,
      "password": password,
      "password_confirmation": password_confirmation
    }
  }
  const myBody = JSON.stringify(sign_up_params);
  const requestOption = {
    method: 'POST',
    headers: myHeaders,
    body: myBody
  }
  fetch(urlSignUpAPI,requestOption)
  .then(response => response.json())
  .then(json => {
    localStorage.token = json.token;
    localStorage.name = json.name;
    localStorage.id= json.id;
    localStorage.bio = json.bio;
    if(localStorage.token !== 'undefined') {
      alert('登録しました。マイページに移動します。')
      move(urlMyPage);
      }else{
        alert('登録に失敗しました');
      }
  })
  .catch(error => `console.log('Error:', ${error}`);
}
//ログイン
const signIn = () => {
  localReset();
  const email = document.getElementById('signInEmail').value;
  const password = document.getElementById('signInPassword').value;
  const sign_in_params = {
    "sign_in_user_params": {
      "email": email,
      "password": password,
    }
  }
  const myBody = JSON.stringify(sign_in_params)
  const requestOption = {
    method: 'POST',
    headers: myHeaders,
    body: myBody
  }
  fetch(urlSignInAPI,requestOption)
  .then(response => response.json())
  .then(json => {
    localStorage.token = json.token;
    localStorage.name = json.name;
    localStorage.id= json.id;
    localStorage.bio = json.bio;
    if(localStorage.token !== 'undefined') {
      move(urlMyPage);
      alert('ログインに成功しました')
    }else{
      alert('メールアドレスかパスワードが間違っています');
    }
  })
  .catch(error => `console.log('Error:', ${error}`);
}
//フォロー
const onclickFollowBotton = (id) => {
  const URL = `${urlUserAPI}/${id}/follow`;
  const requestOption = {
    method: 'POST',
    headers: myTokenHeaders
  }
  fetch(URL,requestOption)
  .then(() => { 
    alert('フォローしました')
  })
  .catch(error => `console.log('Error:', ${error}`);
}
//フォロー解除
const onclickFollowDelete = (id) => {
  const URL = `${urlUserAPI}/${id}/follow`;
  const requestOption = {
    method: 'DELETE',
    headers: myTokenHeaders
  }
  fetch(URL,requestOption)
  .then(alert('フォロー解除しました'))
  .catch(error => `console.log('Error:', ${error}`);
}
//ユーザーリストの取得
const getUserList = () => {
  userList.innerHTML = '';
  const userListParams = {
    page: document.getElementById('pageNamber').value,
    limit: 30,
    query: document.getElementById('search').value,
  }
  const qs = new URLSearchParams(userListParams);
  const URL = `${urlUserAPI}?${qs}`;
  const requestOption = {
    method: 'GET',
    headers: myTokenHeaders,
  }
  fetch(URL,requestOption)
  .then(response => response.json())
  .then(json => {
    for(let i = 0; i < json.length; i ++){
      const p = document.createElement('p');
      p.innerHTML = 
      `ユーザーID：${JSON.stringify(json[i].id)}
      <br>
      ユーザー名前：${JSON.stringify(json[i].name)}
      <br>
      プロフィール：${JSON.stringify(json[i].bio)}
      <br>`
      ;
      p.innerHTML += '<button onclick="onclickFollowBotton(' + json[i].id + ')">フォロー</button>'
      userList.append(p);
    }
  })
  .catch(error => `console.log('Error:', ${error}`);
}
//ユーザー編集
const userEdit = () => {
  const name = document.getElementById('putName').value;
  const bio = document.getElementById('putBio').value;
  const userEditParams = {
    "user_params": {
      "name": name,
      "bio": bio
    }
  }
  const URL = `${urlUserAPI}/${getId}`
  const myBody = JSON.stringify(userEditParams);
  const requestOption = {
    method: 'PUT',
    headers: myTokenHeaders,
    body: myBody
  }
  fetch(URL,requestOption)
  .then(response => response.json())
  .then(json => {
    alert('変更しました')
    localStorage.name = json.name;
    localStorage.bio= json.bio;
    move(urlMyPage)
  })
  .catch(error => `console.log('Error:', ${error}`);
}
//ユーザーの消去
const userDelete = () => {
  const URL = `${urlUserAPI}/${getId}`;
  const requestOption = {
    method: 'DELETE',
    headers: myTokenHeaders
  };
  fetch(URL,requestOption)
  .then(() => {
    alert('ユーザー消去しました')
    removeItem('token')
    removeItem('id')
    removeItem('bio')
    removeItem('name')
    removeItem('postId')
    move(urlSignIn)
  })
  .catch(error => `console.log('Error:', ${error}`);
}
//投稿消去
const myPutDelete = (id) => {
  const URL = `${urlTimeLineAPI}${id}`;
  const requestOption = {
    method: 'DELETE',
    headers: myTokenHeaders
  }
  fetch(URL,requestOption)
  .then( alert('投稿を消去しました'))
  location.reload()
  .catch(error => `console.log('Error:', ${error}`);
}
//My投稿表示
const getTimeLine = () => {
  myPostList.innerHTML = '';
  const timeLinePage = document.getElementById('timeLinePage').value;
  const timeLineWord = document.getElementById('timeLineWord').value;
  const timeLineParams = {
    page: timeLinePage,
    limit: 10,
    query: timeLineWord
  }
  const qs = new URLSearchParams(timeLineParams);
  const URL = `${urlUserAPI}/${getId}/timeline?${qs}`;
  const requestOption = {
    method: 'GET',
    headers: myTokenHeaders
  }
  fetch(URL,requestOption)
  .then(response => response.json())
  .then(json => {
    for(let i = 0; i < json.length; i ++){
      const p = document.createElement('p');
      p.innerHTML = 
      `投稿内容：${JSON.stringify(json[i].text)}
      <br>`;
      myPostList.append(p);
      p.innerHTML += '<button onclick="myPutDelete(' + json[i].id + ')">投稿消去</button>';
      p.innerHTML += '<button onclick="movePostEdit(' + json[i].id + ')">投稿編集</button>';
      console.log(json);
    }
  })
  .catch(error => `console.log('Error:', ${error}`);
}
//投稿
const timeLinePost = () => {
  const postText = document.getElementById('postText').value;
  const timeLinePostParams = {
    "post_params": {
      "text": postText
    }
  }
  const myBody = JSON.stringify(timeLinePostParams);
  const requestOption ={
    method: 'POST',
    headers: myTokenHeaders,
    body: myBody
  }
  fetch(urlTimeLineAPI,requestOption)
  .then(response => response.json())
  .then(json => {
    localStorage.postId = json.id
    alert('投稿完了')
    location.reload()
  }).catch(error => `console.log('Error:', ${error}`);
}
//投稿編集ページに移動
const movePostEdit = (id) => {
  localStorage.postId = id;
  move(urlPostEdit);
}
//投稿を編集
const postEdit = () => {
  const newText = document.getElementById('newText').value;
  const postEditParams ={
    "post_params": {
      "text": newText
    }
  };
  const URL =`${urlTimeLineAPI}${getPostId}`;
  const myBody = JSON.stringify(postEditParams);
  const requestOption = {
    method: 'PUT',
    headers:myTokenHeaders,
    body: myBody
  }
fetch(URL,requestOption)
.then(() => {
  alert('変更しました');
  move(urlMyPost);
}).catch(error => `console.log('Error:', ${error}`);
}
//投稿リスト
const getTimeLineList = () => {
  postList.innerHTML = '';
  const timeLineListParams = {
    page: document.getElementById('postNamber').value,
    limit: 100,
    query: document.getElementById('postSearch').value,
  }
  const qs = new URLSearchParams(timeLineListParams);
  const URL  = `${urlTimeLineAPI}?${qs}`;
  const requestOption ={
    method: 'GET',
    headers: myTokenHeaders
  }
  fetch(URL,requestOption)
  .then(response => response.json())
  .then(json => {
    for(let i = 0; i < json.length; i ++){
      const p = document.createElement('p');
      p.innerHTML = 
      `ユーザーID：${JSON.stringify(json[i].user.id)}
      <br>
      ユーザー名：${JSON.stringify(json[i].user.name)}
      <br>
      投稿内容：${JSON.stringify(json[i].text)}
      <br>
      投稿時間：${JSON.stringify(json[i].user.created_at)}
      <br>`;
      postList.append(p);
    }
  })
  .catch(error => `console.log('Error:', ${error}`);
};
//フォロー一覧
const followList = ()  => {
  myFollowList.innerHTML = '';
  const URL = `${urlUserAPI}/${getId}/followings`;
  const requestOption = {
    method: 'GET',
    headers: myTokenHeaders,
  }
  console.log(URL)
  fetch(URL,requestOption)
  .then(response => response.json())
  .then(json => {
    for(let i = 0; i < json.length; i ++){
      const p = document.createElement('p')
      p.innerHTML = 
      `ユーザーID：${JSON.stringify(json[i].id)}
      <br>
      ユーザー名：${JSON.stringify(json[i].name)}
      <br>
      プロフィール：${JSON.stringify(json[i].bio)}
      <br>`;
      myFollowList.append(p);
      p.innerHTML += '<button onclick="onclickFollowDelete(' + json[i].id + ')">フォロー解除</button>'
    }
  })
  .catch(error => `console.log('Error:', ${error}`);
}   
//フォロワー一覧
const followersList = ()  => {
  myFollowersList.innerHTML = '';
  const URL = `${urlUserAPI}/${getId}/followers`;
  const requestOption = {
    method: 'GET',
    headers: myTokenHeaders,
  }
  fetch(URL,requestOption)
  .then(response => response.json())
  .then(json => {
    for(let i = 0; i < json.length; i ++){
      const p = document.createElement('p')
      p.innerHTML = 
      `ユーザーID：${JSON.stringify(json[i].id)}
      <br>
      ユーザー名：${JSON.stringify(json[i].name)}
      <br>
      プロフィール：${JSON.stringify(json[i].bio)}
      <br>`;
      myFollowersList.append(p);
    }
  })
  .catch(error => `console.log('Error:', ${error}`);
}

//チャットルームの作成
const createRoom = () => {
  const newChatName = document.getElementById('newChatName').value;
  const params = {
    "chatroom_params": {
    "name": newChatName
    }
  }
  const myBody = JSON.stringify(params);
  const requestOption = {
    method: 'POST',
    headers: myTokenHeaders,
    body: myBody
  }
  fetch(urlChatRoomAPI,requestOption)
  .then(alert('チャットルーム'))
  location.reload()
  .catch(error => `console.log('Error:', ${error}`); 
}
//チャットルーム一覧
const getChatRoom = () => {
  chatRoomList.innerHTML = '';
  const chatSearchPage = document.getElementById('chatSearchPage').value;
  const cahtSearchWord = document.getElementById('chatSearchWord').value;
  const params = {
    Page: chatSearchPage,
    limit:10,
    query:cahtSearchWord
  }
  const qs = new URLSearchParams(params);
  const URL =  `${urlChatRoomAPI}?${qs}`;
  const requestOption = {
    method: 'GET',
    headers: myTokenHeaders,
  };
  fetch(URL,requestOption)
  .then(response => response.json())
  .then(json => {
    for(let i = 0; i < json.length; i ++){
      const p = document.createElement('p')
      p.innerHTML = 
      `ルーム名ID：${JSON.stringify(json[i].id)}
      <br>
      ルーム名：${JSON.stringify(json[i].name)}
      <br>
      参加人数：${JSON.stringify(json[i].joined_chat_users_count)}
      <br>`;
      p.innerHTML += '<button onclick="joinChatRoom(' + json[i].id + ')">参加</button>'
      chatRoomList.append(p);
      console.log(json[i]);
    }
  })
}
//チャットルームに参加
const joinChatRoom　= (id) => {
  const URL = `${urlChatRoomAPI}/${id}/join`;
  console.log(URL)
  const requestOption = {
    method: 'POST',
    headers: myTokenHeaders
  }
  fetch(URL,requestOption)
  .then(response => JSON.stringify(response))
  .then(() => {
    localStorage.chatRoomId = id;
    alert('参加しました');
    move(urlEntryChatRoom);
  })
  .catch(error => `console.log('Error:', ${error}`);
}
//チャットルームにメッセージを送る 
const messageChatRoom = (id) => {
  const URL = `${urlChatRoomAPI}/${id}/messages`;
  const chatPostMessage = document.getElementById('chatPostMessage').value;
  const params = {
    "message_params": {
      "text": chatPostMessage
    }
  }
  const myBody = JSON.stringify(params);
  const requestOption = {
    method: 'POST',
    headers: myTokenHeaders,
    body: myBody
  }
  console.log(URL)
  console.log(moveBy)
  fetch(URL,requestOption)
  .then(response => response.json())
  .then(json => console.log(json))
}
//チャットルームのメッセージ取得
const getChatRoomMessage = (chatId) => {
  messageList.innerHTML = '';
  const params = {
    id:'0'
  }
  const qs = new URLSearchParams(params);
  const URL =  `${urlChatRoomAPI}/${chatId}/messages?${qs}`;
  console.log(URL)  
  const requestOption = {
    method: 'GET',
    headers: myTokenHeaders
  }
  fetch(URL,requestOption)
  .then(response => response.json())
  .then(json => {
    for(let i = 0; i < json.length; i ++){
      const p = document.createElement('p')
      p.innerHTML = 
      `メッセージID：${JSON.stringify(json[i].id)}
      <br>
      名前：${JSON.stringify(json[i].user.name)}
      <br>
      メッセージ：${JSON.stringify(json[i].text)}
      <br>`;
      messageList.append(p);
      console.log(json[i]);
    }
  })
}
