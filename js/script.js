// fetch('https://api.chucknorris.io/jokes/random')
//   .then(response => response.json())
//   .then(data => console.log(data));

// async function getData(){
// 	let joke = await fetch('https://api.chucknorris.io/jokes/random');
// 	let result = await joke.json();

// 	console.log(result);
// }

// getData();

const jokeURL = 'https://api.chucknorris.io/jokes';

class Joke{

	static async getJoke(e){
		e.preventDefault();
		
		let type = this.querySelector('input[name=joke]:checked').value;
		let result;

		switch(type){
			case 'categories':
				let category = document.querySelector('.categories input:checked').value;
				//console.log(category);
				result = await Joke.fetchJoke(`random?category=${category}`);
				break;
			case 'random':
				result = await Joke.fetchJoke(type);
				break;
			case 'search':
				result = await Joke.fetchJoke(`search?query=${searchJoke.value}`);
				break;
		}

		Joke.renderJoke(result);
	}

	static async fetchJoke(type){
		let data = await fetch(`${jokeURL}/${type}`),
			response = await data.json();

		return response;
	}

	static async renderCategories(){
		let data = await Joke.fetchJoke('categories');

		let categoriesDiv = document.querySelector('.categories');
		categoriesDiv.innerHTML = '';

		data.forEach(category=>{
			let label = document.createElement('label');
			label.innerHTML = category;

			let input = document.createElement('input');
			input.type = 'radio';
			input.name = category;
			input.value = category;
			input.addEventListener('change',(e)=>{
				//console.log(e.target);

				let activeLabel = categoriesDiv.querySelector('label.active');
				activeLabel && activeLabel.classList.remove('active');

				let currentLable = e.target.closest('label');
				currentLable.classList.add('active');
			})

			label.append(input);
			categoriesDiv.append(label);
		});
	}

	static renderJoke(data){

		if(data.result && data.result.length>0){
			data.result.forEach(joke=>Joke.renderJoke(joke));
		} else{

			let jokeDiv = document.createElement('div');
			jokeDiv.classList.add('joke__block');

			jokeDiv.innerHTML = `<p>${data.value}</p>`;
			jokeDiv.innerHTML += `<img src="${data.icon_url}" width=50>`;

			if(data.categories.length>0){
				data.categories.forEach(categoty=>{
					jokeDiv.innerHTML += `<p class="joke__category">Category: ${categoty}</p>`;
				})
			}

			let date = new Date(data.created_at);
			//console.log(date);
			jokeDiv.innerHTML += `<p>Date: ${date.getFullYear()}</p>`;

			let favourite = document.createElement('button');
			favourite.innerHTML = '🖤';
			favourite.addEventListener('click',()=>Joke.addToFavourite(favourite));

			jokeDiv.appendChild(favourite);

			jokesWrapper.append(jokeDiv);
		}
	}

	static addToFavourite(favourite){
		if(favourite.innerHTML === '❤️'){
			favourite.innerHTML = '🖤';

		}else{
			favourite.innerHTML = '❤️';
		}
	}
}


let getJoke = document.querySelector('#getJoke'),
	inputCategories = document.querySelector('input[name=joke][value=categories]'),
	inpuTypes = document.querySelectorAll('input[name=joke]'),
	categoriesBlock = document.querySelector('.categories'),
	searchJoke = document.querySelector('#searchJoke'),
	jokesWrapper = document.querySelector('#jokes__wrapper');

getJoke.addEventListener('submit', Joke.getJoke);
inputCategories.addEventListener('change',Joke.renderCategories);

inpuTypes.forEach(input=>{
	input.addEventListener('change',(e)=>{
		let currentInput = e.target,
			value = currentInput.value;

		value !== 'categories' ? categoriesBlock.classList.add('hide') : categoriesBlock.classList.remove('hide');
	})
})







