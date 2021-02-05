let myFirstPromise = new Promise((resolve, reject) => {
    // 當非同步作業成功時，呼叫 resolve(...),而失敗時則呼叫 reject(...)。
    // 在這個例子中，使用 setTimeout(...) 來模擬非同步程式碼。
    // 在實務中，您將可能使用像是 XHR 或者一個 HTML5 API.
    setTimeout(function(){
      resolve("Success!"); // Yay！非常順利！
    }, 2500);
  });
  
myFirstPromise.then((successMessage) => {
    // successMessage 是任何您由上方 resolve(...) 傳入的東西。
    // 在此僅作為成功訊息，但是它不一定是字串。
    console.log("Yay! " + successMessage);
});

console.log("OwO")
  