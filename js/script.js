
const jokeURL = 'https://api.chucknorris.io/jokes';

class Form{
  //анализ, какую шутку получаем
  static async getJoke(e){
    	e.preventDefault();
  //в нашей форме мы ищем 
  let type = this.querySelector('input[name=joke]:checked').value;
  // console.log(type);//вывод random если выбрали random
  //тип шутки type(random или categories)
  	let result;

    switch(type){
			case 'categories':
				let category = document.querySelector('.categories input:checked').value;
				//console.log(category);
				result = await Form.fetchJoke(`random?category=${category}`);
				break;
			case 'random':
				result = await Form.fetchJoke(type);
				break;
			case 'search':
				result = await Form.fetchJoke(`search?query=${searchJoke.value}`);
				break;
		}
    //вызвать создание шутки
		Joke.createJoke(result);
   
  }
  //отправка запроса 
  static  async fetchJoke(type){
    	let data = await fetch(`${jokeURL}/${type}`),// запрос на https://api.chucknorris.io/jokes
      	response = await data.json();
        return response;
  }
  //отрисовали Categories
  //data - ссылка на шутку (запром)
  static async renderCategories(){
    let data = await Form.fetchJoke('categories');
    console.log(data);

    let categoriesDiv = document.querySelector('.categories');
    categoriesDiv.style.padding = ' 15px 0';
    categoriesDiv.innerHTML = '';

    data.forEach(category=>{
        let label = document.createElement('label');
        label.innerHTML = category;

      	let input = document.createElement('input');
        	input.type = 'radio';
          input.name = category;
          input.value = category;
          input.addEventListener('change',(e)=>{

          let activeLabel = categoriesDiv.querySelector('label.active');
          activeLabel && activeLabel.classList.remove('active');

            //нажали выбрать  и на инпут меняем  background-color
            let currentLable = e.target.closest('label');
			        	currentLable.classList.add('active');
          })


            label.append(input);
            categoriesDiv.append(label);
    });

  }

  static  renderFavJoke(){


    //забирает из localStorage поле jokes
    let jokes =JSON.parse(localStorage.jokes);
    if(jokes && jokes.length>0){
			jokes.forEach(joke=>{
				Joke.createJoke(joke,jokes__fav );
			});
		}
  }

}

class Joke{

  //создадим дополнительно Joke поле favourite
  constructor(){
    this.favourite =  false;
  }

  //будет создавать экземпляр класса (создать шутку)
  static createJoke(data,renderBlock){
    console.log(data);//полученная шутка
    if(data.result && data.result.length>0){
			data.result.forEach(joke=>Joke.createJoke(joke));
		}else {
      //если в шутке есть дополнительно result( в которой нах-яся все данные )
      //то joke делаем экземпляром объекта Joke ( что бы были доступны все методы)
        let joke = new Joke();
        for(let key in data){
          //и все значения Joke мы пишем в новый объект Joke
          joke[key] = data[key];
        }
        console.log(joke);
        //вызываем renderJoke отрисовать новый объект joke
        joke.renderJoke(renderBlock);
    }


  }
  //отрисовали Categrandomories
  renderJoke(renderBlock){
    let data = this;
    // console.log(data);// шутка, к-я
      // console.log(data.value);

        //общий div
        let jokeDiv = document.createElement('div');
			  jokeDiv.classList.add('joke__block');
        jokeDiv.id = data.id;//id нашей шутки

        //нужна ссылка
       
        let link = `<a href="${data.url}" class="link-post" target="_blank">
                      <p>${data.id}</p>
                      <img src="img/link.svg">
                    </a>`;
        //текст
        jokeDiv.innerHTML = `${link}
                            <p class="text-main">${data.value}</p>`;
        //фото
			  jokeDiv.innerHTML += `<img src="${data.icon_url}" class="img-post">`;
       
       //div d-f

        jokeDiv.innerHTML += `<div class="wrapperDiv"></div>`;

        //дата
        const date1 = new Date(data.created_at);
        // console.log(date1);//время создания шутки
        const date2 = new Date();
        // console.log(date2);//дата сегодня
        let date = Math.floor((date2-date1)/3669445);

        
        let wrapperDiv = jokeDiv.querySelector('.wrapperDiv');
        // console.log(wrapperDiv);

        wrapperDiv.innerHTML += `<p class="text-data">Last update: ${date} hours ago</p>`;
      
        //категория
         if(data.categories.length>0){
          data.categories.forEach(categoty=>{
            wrapperDiv.innerHTML += `<a href="https://api.chucknorris.io/" class="joke__category" target="_blank"> ${categoty}</a> `;
            
          })
        }

        //сердце
        let favourite = document.createElement('button');
        favourite.classList.add('favourite');
        favourite.style.background = this.favourite ?  'url(./img/heart2.png)no-repeat center' : 'url(./img/heart.png)no-repeat center';
        favourite.addEventListener('click',()=>data.addToFavourite(favourite));

        //сообщение
        let message = document.createElement('div');
        message.classList.add('message');
     


       jokeDiv.appendChild(message);
        jokeDiv.appendChild(favourite);
      //  jokeDiv.appendChild(wrapperDiv);
        //общий div в jokesWrapper
        // jokesWrapper.append(jokeDiv);
        if(!renderBlock){
          jokesWrapper.append(jokeDiv);
        } else {
          let header = document.querySelector('.header');
          header.classList.add('header-background');
          let h2 = document.createElement('h2');
          h2.textContent = 'Favourite';
          offerFavorit.append(h2); 

          jokeDiv.classList.add('joke__block_dubl');
          message.style.backgroundColor = '#F8F8F8';
        
          offerFavorit.append(jokeDiv);

        }

  }


  addToFavourite(favourite){
    this.favourite = !this.favourite;
   

    //меняем background у сердечка при нажатии на него
    // let jokeBlock = document.getElementsById(`#${this.id} .favourite`);
    let jokeBlock = document.querySelector(`#${this.id}`);//button
    jokeBlock.style.background = 'url(./img/heart2.png)no-repeat center';
    jokeBlock.style.background  =  this.favourite ?  'url(./img/heart2.png)no-repeat center' : 'url(./img/heart.png)no-repeat center';
 
    if(this.favourite){
      let jokes = localStorage.jokes ? JSON.parse(localStorage.jokes) : [];
        jokes.push(this);
        //  console.log(jokes);
        localStorage.jokes = JSON.stringify(jokes);

        jokeBlock.remove();
        this.renderJoke(jokes__fav);
    }
    else {
    //если с шутки сняли лайк
        let jokes = JSON.parse(localStorage.jokes);
       

    console.log(jokes);
    let getCurrentJoke = jokes.filter((joke)=>joke.id !== this.id);
      console.log(getCurrentJoke);
      //записали в  localStorage обновленные данные 
      localStorage.jokes = JSON.stringify(getCurrentJoke);


    }


	}
}
// Joke.addToFavourite();
let getJoke = document.querySelector('#getJoke'),
inpuTypes = document.querySelectorAll('input[name=joke]'),
categoriesBlock = document.querySelector('.categories'),
inputCategories = document.querySelector('input[name=joke][value=categories]'),
labelSearch = document.querySelector('input[name=joke][value=search]'),
searchJoke = document.querySelector('#searchJoke'),
jokesWrapper = document.querySelector('#jokes__wrapper'),
offerFavorit = document.querySelector('.offer-favorit'),
jokes__fav  = document.querySelector('.jokes__fav');

getJoke.addEventListener('submit', Form.getJoke);
inputCategories.addEventListener('change',Form.renderCategories);


inpuTypes.forEach(input=>{
	input.addEventListener('change',(e)=>{
		let currentInput = e.target,
			value = currentInput.value;
      currentInput.style.border = 'none';
    value === 'categories' ? categoriesBlock.classList.remove('hide') : categoriesBlock.classList.add('hide');
    value === 'search' ? searchJoke.classList.remove('hide') : searchJoke.classList.add('hide');
	})
})



