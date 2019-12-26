'use strict'

const urlSignUp = 'https://teachapi.herokuapp.com/sign_up';//API URLリスト
const urlSignIn = 'https://teachapi.herokuapp.com/sign_in';
const urlUser = 'https://teachapi.herokuapp.com/users/';
const urlTimeLine = 'https://teachapi.herokuapp.com/posts/';

const urlIndex= 'index.html'; //html URLリスト
const urlUserHtml = 'user.html' ;
const urlMyPage = 'myPage.html';

const signIn = document.getElementsByClassName('signIn');
const userList = document.getElementById('userList');
const timeLine = document.getElementById('timeLine');
const postList = document.getElementById('postList');
const myPostList = document.getElementById('myPostList');
const myName = document.getElementById('myName');
const myId = document.getElementById('myId');
const myBio = document.getElementById('myBio');

const removeItem = (key) => {         //ローカルストレージのリセット
  window.localStorage.removeItem(key);
}
const localReset = () => {
  removeItem('token');
  removeItem('id');
  removeItem('bio');
  removeItem('name');
  removeItem('postId');
}
const getToken = 'Bearer '+ window.localStorage.getItem('token'); //ローカルストレージから値を取り出す
const getId = window.localStorage.getItem('id');
// const getPostId = window.localStorage.getItem('postId');

const move = (url) => {//ページ移動
  location.href = url ;
}
const logout = () => {//ログアウト
  localReset();
  move(urlIndex);
}

const getSignUp = () => {//アカウント登録
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
  const str = JSON.stringify(sign_up_params);
  fetch(urlSignUp,{
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body:str
  })
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
}  
const getSignIn = () => {//ログイン
  localReset();
  const email = document.getElementById('signInEmail').value;
  const password = document.getElementById('signInPassword').value;

  const sign_in_params = {
    "sign_in_user_params": {
      "email": email,
      "password": password,
    }
  }
  const str = JSON.stringify(sign_in_params)
  console.log(sign_in_params);
  fetch(urlSignIn,{
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body:str
  })
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

const getUserList = () => {//ユーザーリストの取得
  userList.innerHTML = '';
  const userListParams = {
    page: document.getElementById('pageNamber').value,
    limit: 30,
    query: document.getElementById('search').value,
  }
  const qs = new URLSearchParams(userListParams);
  fetch(`${urlUser}?${qs}`,{
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getToken},
  })
  .then(response => response.json())
  .then(json => {
    for(let i = 0; i < json.length; i ++){
      const p = document.createElement('p');
      p.textContent = 
      `ユーザーID：${JSON.stringify(json[i].id)}
      ユーザー名前：${JSON.stringify(json[i].name)}
      プロフィール：${JSON.stringify(json[i].bio)}`
      ;
      userList.append(p);
    }
  })
}

const putUser = () => {//ユーザー編集
  const name = document.getElementById('putName').value;
  const bio = document.getElementById('putBio').value;
  const putUserParams = {
    "user_params": {
      "name": name,
      "bio": bio
    }
  }
  const str = JSON.stringify(putUserParams);
  fetch(`${urlUser}/${getId}`,
    {method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getToken
      },
      body:str
    }
  )
  .then(response => response.json())
  .then(json => {
    alert('変更しました')
    localStorage.name = json.name;
    localStorage.bio= json.bio;
    move(urlMyPage)
  })
}

const deleteUser = () => {//ユーザーの消去
  fetch(`${urlUser}${getId}`,
    {method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getToken
      }
    }
  )
  .then(alert('ユーザー消去しました'));
  removeItem('token');
  removeItem('id');
  removeItem('bio');
  removeItem('name');
  removeItem('postId');
  move(urlIndex);
}

const getTimeLine = () => {//Myタイムライン表示
  myPostList.innerHTML = '';
  const timeLinePage = document.getElementById('timeLinePage').value;
  const timeLineWord = document.getElementById('timeLineWord').value;
  const timeLineParams = {
    page: timeLinePage,
    limit: 10,
    query: timeLineWord
  }
  const qs = new URLSearchParams(timeLineParams);
  fetch(`${urlUser}${getId}/timeline?${qs}`,
  {headers: {
    'Content-Type': 'application/json',
    'Authorization': getToken},
  }
  )
  .then(response => response.json())
  .then(json => {
    for(let i = 0; i < json.length; i ++){
      const p = document.createElement('p');
      p.textContent = 
      `投稿ID：${JSON.stringify(json[i].id)}
      ${JSON.stringify(json[i].text)}`;
      myPostList.append(p);
    }
  })
}

const timeLinePost = () => {//タイムラインに投稿
  const postText = document.getElementById('postText').value;
  const timeLinePostParams = {
    "post_params": {
    "text": postText
    }
  }
  const str = JSON.stringify(timeLinePostParams);
  fetch(urlTimeLine,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': getToken,
    },
    body: str
  })
  .then(response => response.json())
  .then(json =>
  localStorage.postId= json.id
  );
  alert('投稿完了');
  location.reload();
}
const timeLinePut = () => {//投稿を編集
  const putText = document.getElementById('putText').value;
  const putPostId = document.getElementById('putPostId').value;
  const timeLinePUtParams ={
    "post_params": {
      "text": putText
    }
  };
  const str = JSON.stringify(timeLinePUtParams);
fetch(`${urlTimeLine}${putPostId}`,{
method: 'PUT',
headers: {
  'Content-Type': 'application/json',
  'Authorization': getToken
},
body: str
});
alert('変更しました');
location.reload();
}

const timeLinePostDelete = () => {//投稿消去
  const deletePostId = document.getElementById('deletePostId').value;
  fetch(`${urlTimeLine}${deletePostId}`,
    {method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getToken
      }
    }
  )
  .then( 
  alert('投稿を消去しました'))
  location.reload()
  };
  
  const getTimeLineList = () => {//投稿リスト
    postList.innerHTML = '';
    const timeLineListParams = {
      page: document.getElementById('postNamber').value,
      limit: 100,
      query: document.getElementById('postSearch').value,//単語を入れると検索できる
    }
    const qs = new URLSearchParams(timeLineListParams);
    console.log(qs);
    fetch(`${urlTimeLine}?${qs}`,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': getToken},
    })
    .then(response => response.json())
    .then(json => {
      for(let i = 0; i < json.length; i ++){
        const p = document.createElement('p');
        console.log(json[i]);
        p.textContent = 
        `投稿ID：${JSON.stringify(json[i].id)}
        ユーザーID：${JSON.stringify(json[i].user.id)}
        ユーザー名：${JSON.stringify(json[i].user.name)}
        投稿内容：${JSON.stringify(json[i].text)}
        投稿時間：${JSON.stringify(json[i].user.created_at)}`
        ;
        postList.append(p);
      }
    })
  };
