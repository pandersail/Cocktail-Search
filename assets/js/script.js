const nameInput = $('#search-box-name'); 
const ingredientInput = $('#search-box-ingredient'); 
const categoryInput = $('#search-box-category');
const submitBtn = $('.submit-btn')

getURLName = (name) => {
     // standardise capitals
    let searchWords = name.split(' ');
    let processedWords = [];

    searchWords.forEach((word) => {
        let newWord = word.toLowerCase();
        newWord = newWord[0].toUpperCase() + newWord.slice(1); 
        processedWords.push(newWord);
    })
     let processedSearchTerm = processedWords.join('_'); 
    return `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${processedSearchTerm}`
    // gives full info about drink
}
getURLIngredient = (ingredient) => {
      // standardise capitals
      let searchWords = ingredient.split(' ');
      let processedWords = [];
  
      searchWords.forEach((word) => {
          let newWord = word.toLowerCase();
          newWord = newWord[0].toUpperCase() + newWord.slice(1); 
          processedWords.push(newWord);
      })
       let processedSearchTerm = processedWords.join('_'); 
       return `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${processedSearchTerm}`
    // gives name, jpg src, and id
}
getURLCategory = (category) => {
    return `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`; 
    // gives name, jpg src, and id
}

// ANGELO
// START HERE
// COLUMNS ADDED HERE. YOU CAN CHANGE BOOTSTRAP/OWN CLASSES 
const addImageFunc = (newRow, drink) => {
     let imageCol = $('<div>')
    imageCol.attr('class', 'col col-lg-4')
    imageCol.html(`<img src=${drink['strDrinkThumb']}></img>`)
    newRow.append(imageCol)
}
const addIngredientFunc = (newRow, drink) => {
    let ingredientCol = $('<div>');
    ingredientCol.attr('class', 'col col-md-6 col-lg-4');
    let newList = $('<ul>')
    // there are up to 15 ingredients in the API
    for (let i = 1; i<16; i++) {
        if (drink[`strIngredient${i}`]) {
            newList.append(`<li>${drink[`strIngredient${i}`]}</li>`)
        }
    }
    ingredientCol.append(newList);
    newRow.append(ingredientCol);
}

const addRecipeFucn = (newRow, drink) => {
    let recipeCol = $('<div>'); 
    recipeCol.attr('class', 'col col-md-6 col-lg-4');
    recipeCol.append(`<p>${drink['strInstructions']}</p>`)
    newRow.append(recipeCol)
}
// ANGELO
// END HERE

submitBtn.on('click', async (event) => {
    event.preventDefault(); 
    let name = nameInput.val();
    console.log('name: ' + name)
    let ingredient = ingredientInput.val();
    console.log('ingredient: ' + ingredient)
    let category = categoryInput.val(); 
    console.log('category: ' + category)
    let IDnums = []; 

    if (!name && !ingredient && !category) {
        console.warn('!name && !ingredient && !category')
        return 
    } else {
    if (name) {
        console.warn('name only'); 
        // get ids for first 3 containing search name
        let response = await $.ajax({
         method: 'GET',
         url: getURLName(name)
        })
            for (let i = 0; i < 3; i++) {
                if (response['drinks'][i]) {
                    IDnums.push(response['drinks'][i]['idDrink'])
                }
            }
     } else {
         if (ingredient && !category) {
            console.warn('ingredient only')
            // id for search by ingredients
            let response = await $.ajax({
                method: 'GET',
                url: getURLIngredient(ingredient)
            });
                for (let i = 0; i < 3; i++) {
                    IDnums.push(response['drinks'][i]['idDrink'])
                }
         } else if (category && !ingredient) {
            console.warn('category only')
             // id for search by category
             let response = await $.ajax({
                method: 'GET',
                url: getURLCategory(category)
            });
                for (let i = 0; i < 3; i++) {
                    IDnums.push(response['drinks'][i]['idDrink'])
                }
         } else {
            console.warn('category and ingredient')
             // if both category and ingredient
             let ingArray = [];
             let catArray = [];
            let ingResponse = await $.ajax({
                method: 'GET',
                url: getURLIngredient(ingredient)
            });
                for (let i = 0; i < ingResponse['drinks'].length; i++) {
                    ingArray.push(ingResponse['drinks'][i]['idDrink']); 
                }
            
            let catResponse = await $.ajax({
                method: 'GET',
                url: getURLCategory(category)
            });
                for (let i = 0; i < catResponse['drinks'].length; i++) {
                    catArray.push(catResponse['drinks'][i]['idDrink']); 
                }

            ingArray.forEach(ingID => {
                if (catArray.find(catID => catID === ingID)) {
                    IDnums.push(item);
                }
            }) 
            if (IDnums.length > 3) {
                IDnums = IDnums.splice(0,2); 
            }
         } 
     }
 
     console.log(IDnums); 

    //  Info on page from this call
     IDnums.forEach(drinkID => {
        $.ajax({
            method: 'GET',
            url: `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${drinkID}`
        }).then(response => {
                let drink = response['drinks'][0];
                console.log(drink);
                let newRow = $('<div>'); 
                newRow.attr('class', 'row');
                
                addImageFunc(newRow, drink);
                addIngredientFunc(newRow, drink);
                addRecipeFucn(newRow, drink); 
    
                $('.results').append(newRow);     
        })
     })
    }
})

const randomBtn = $('.random')
randomBtn.on('click', () => {
   $.ajax({
    method: 'GET',
    url: 'https://www.thecocktaildb.com/api/json/v1/1/random.php'
   }).then(response => {
    console.log(response)
    let drink = response['drinks'][0];
    let newRow = $('<div>'); 
    newRow.attr('class', 'row');

    addImageFunc(newRow, drink);
    addIngredientFunc(newRow, drink);
    addRecipeFucn(newRow, drink); 

    $('.results').append(newRow);  
   })
})