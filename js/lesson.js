fetch('https://api.chucknorris.io/jokes/random')
  .then(response => response.json())
  .then(data => console.log(data));

  //async 
// async function getData(){
//   setTimeout(()=>console.log('hi'),1000);
// }

//  getData();

async function getData(){
  let joke = await fetch('https://api.chucknorris.io/jokes/random');
  //ждем ответа joke, прописывая await
  let result = await joke.json();

  console.log(result);
}

 getData();