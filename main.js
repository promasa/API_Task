'use strict'
//API URLリスト
const urlSignUp = 'https://teachapi.herokuapp.com/sign_up';
const urlSignIn = 'https://teachapi.herokuapp.com/sign_in';
const urlUser = 'https://teachapi.herokuapp.com/users/';
const urlTimeLine = 'https://teachapi.herokuapp.com/posts/';
//html URLリスト
const urlIndex= 'index.html'; 
const urlUserHtml = 'user.html' ;
const urlMyPage = 'myPage.html';

const userList = document.getElementById('userList');
const postList = document.getElementById('postList');
const myPostList = document.getElementById('myPostList');
const myFollowList = document.getElementById('myFollowList');
const myFollowersList = document.getElementById('myFollowersList');
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
}
//ローカルストレージから値を取り出す
const getToken = 'Bearer '+ window.localStorage.getItem('token'); 
const getId = window.localStorage.getItem('id');
//ページ移動
const move = (url) => {
  location.href = url ;
}
//ログアウト
const logout = () => {
  localReset();
  move(urlIndex);
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
const getSignUp = () => {
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
  fetch(urlSignUp,requestOption)
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
const getSignIn = () => {
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
  fetch(urlSignIn,requestOption)
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
//フォローボタン
const onclickFollowBotton = (id) => {
  const URL = `${urlUser}${id}/follow`;
  const requestOption = {
    method: 'POST',
    headers: myTokenHeaders
  }
  fetch(URL,requestOption)
  .then(alert('フォローしました'))
  .catch(error => `console.log('Error:', ${error}`);
}
//フォロー解除
const onclickFollowDelete = (id) => {
  const URL = `${urlUser}${id}/follow`;
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
  const URL = `${urlUser}?${qs}`;
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
const putUser = () => {
  const name = document.getElementById('putName').value;
  const bio = document.getElementById('putBio').value;
  const putUserParams = {
    "user_params": {
      "name": name,
      "bio": bio
    }
  }
  const URL = `${urlUser}/${getId}`
  const myBody = JSON.stringify(putUserParams);
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
const deleteUser = () => {
  const URL = `${urlUser}${getId}`;
  const requestOption = {
    method: 'DELETE',
    headers: myTokenHeaders
  }
  fetch(URL,requestOption)
  .then(alert('ユーザー消去しました'))
  removeItem('token')
  removeItem('id')
  removeItem('bio')
  removeItem('name')
  removeItem('postId')
  move(urlIndex)
  .catch(error => `console.log('Error:', ${error}`);
}
const myPutDelete = (id) => {
    const deletePostId = document.getElementById('deletePostId').value;
    const URL = `${urlTimeLine}${id}`;
    const requestOption = {
      method: 'DELETE',
      headers: myTokenHeaders
    }
    fetch(URL,requestOption)
    .then( alert('投稿を消去しました'))
    location.reload()
    .catch(error => `console.log('Error:', ${error}`);
}
//Myタイムライン表示
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
  const URL = `${urlUser}${getId}/timeline?${qs}`;
  const requestOption = {
    method: 'GET',
    headers: myTokenHeaders
  }
  fetch(URL,requestOption)
  .then(response => response.json())
  .then(json => {
    for(let i = 0; i < json.length; i ++){
      const p = document.createElement('p');
      p.textContent = 
      `投稿ID：${JSON.stringify(json[i].id)}
      ${JSON.stringify(json[i].text)}`;
      myPostList.append(p);
      p.innerHTML += '<button onclick="myPutDelete(' + json[i].id + ')">投稿消去</button>'
    }
  })
  .catch(error => `console.log('Error:', ${error}`);
}
//タイムラインに投稿
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

  fetch(urlTimeLine,requestOption)
  .then(response => response.json())
  .then(json =>
  localStorage.postId= json.id
  )
  alert('投稿完了')
  location.reload()
  .catch(error => `console.log('Error:', ${error}`);
}
//投稿を編集
const timeLinePut = () => {
  const putText = document.getElementById('putText').value;
  const putPostId = document.getElementById('putPostId').value;
  const timeLinePUtParams ={
    "post_params": {
      "text": putText
    }
  };
  const URL =`${urlTimeLine}${putPostId}`;
  const myBody = JSON.stringify(timeLinePUtParams);
  const requestOption = {
    method: 'PUT',
    headers:myTokenHeaders,
    body: myBody
  }
fetch(URL,requestOption)
.then(alert('変更しました'))
location.reload()
.catch(error => `console.log('Error:', ${error}`);
}
  //投稿リスト
  const getTimeLineList = () => {
    postList.innerHTML = '';
    const timeLineListParams = {
      page: document.getElementById('postNamber').value,
      limit: 100,
      query: document.getElementById('postSearch').value,//単語を入れると検索できる
    }
    const qs = new URLSearchParams(timeLineListParams);
    const URL  = `${urlTimeLine}?${qs}`;
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
    const URL = `${urlUser}${getId}/followings`;
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
    const URL = `${urlUser}${getId}/followers`;
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