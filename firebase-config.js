
var firebaseConfig = {
  apiKey: "AIzaSyD8OJd__mniA4cncPAEZvKh2hImqPRdbjk",
  authDomain: "todo-app-7ffe8.firebaseapp.com",
  databaseURL: "https://todo-app-7ffe8-default-rtdb.firebaseio.com",
  projectId: "todo-app-7ffe8",
  storageBucket: "todo-app-7ffe8.appspot.com",
  messagingSenderId: "978009707214",
  appId: "1:978009707214:web:b75aa704c258c36d8ef69f"
};


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
var database = firebase.database();
