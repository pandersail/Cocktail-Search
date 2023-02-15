// AGE CONFIRM POPUP (MODAL)
let agePopup = $('#agepopup'); 
let ageConfirmBtn = $('#confirm-age'); 
let dobInput = $('#date-input');

ageConfirmBtn.on('click', () => {
    let dob =  moment(dobInput.val(), 'YYYY-MM-DD');
    let today = moment();
    let difference = moment.duration(today.diff(dob)); 
    let age = difference['_data']['years']

    if (age >= 18)  {
        agePopup.addClass('hide'); 
    } else {
        window.location.href = 'https://www.thespruceeats.com/summer-drinks-for-kids-4165867'
    }
}); 

// HOW IT WORKS? MODAL
let howItWorks = $('#how-it-works'); 
let howItWorksOpen = $('.instructions-open');
let howItWorksClose =$('.instructions-close'); 

howItWorksOpen.on('click', () => {
    howItWorks.removeClass('hide'); 
}); 
howItWorksClose.on('click', () => {
    howItWorks.addClass('hide'); 
}); 

// MISC ELEMENTS ON PAGE
const nameInput = $('#search-box-name'); 
const ingredientInput = $('#search-box-ingredient'); 
const categoryInput = $('#search-box-category');
const numberInput = $('#number-input');
const submitBtn = $('.submit-btn');
const resultsSection = $('.results'); 
const noSearchWarning = $('#no-search-warning'); 

// URL BUILDER FUNCTIONS
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

// BOOTSTRAP COLUMN BUILDER FUNCTIONS
// 1st column - image
const addImageFunc = (newRow, drink) => {
     let imageCol = $('<div>')
    imageCol.attr('class', 'col col-lg-4 ')
    imageCol.html(`<img src=${drink['strDrinkThumb']}></img>`)
    newRow.append(imageCol)
}
// 2nd column - title, ingredients list
const addIngredientFunc = (newRow, drink) => {
    let ingredientCol = $('<div>');
    ingredientCol.attr('class', 'col col-md-6 col-lg-4 result-text');

    let title = $('<h4>');
    title.text(drink['strDrink']);

    let newList = $('<ul>')
    // there are up to 15 ingredients in the API
    for (let i = 1; i<16; i++) {
        if (drink[`strIngredient${i}`]) {
            newList.append(`<li>${drink[`strIngredient${i}`]}</li>`)
        }
    }
    ingredientCol.append(title); 
    ingredientCol.append(newList);
    newRow.append(ingredientCol);
}
// 3rd column - fav btn, recipe
const addRecipeFucn = (newRow, drink) => {
    let recipeCol = $('<div>'); 
    recipeCol.attr('class', 'col col-md-6 col-lg-4 result-text');

    let favBtn = $('<button>');
    favBtn.attr('type', 'button');
    favBtn.attr('class', 'favourite-btn');
    favBtn.attr('data-id', drink['idDrink']); 
    favBtn.attr('data-name', drink['strDrink']); 
    // favBtn.html('<i class="fa fa-solid fa-heart"></i>Favourite'); using icon image instead of text
 
    recipeCol.append(`<p>${drink['strInstructions']}</p>`); 
    recipeCol.append(favBtn); 
    newRow.append(recipeCol); 
}
// ROW BUILDER FUNCTION 
let newRowAjax = (drinkID) => {
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

            resultsSection.append(newRow);     
    })
}

// CLEAR SEARCH FUNCTION
let clearSearchFunc = () => {
    ingredientInput.val('');
    nameInput.val('');
    categoryInput.val(''); 
} 

// SUBMIT CLICK LISTENER
submitBtn.on('click', async (event) => {
    event.preventDefault(); 
    resultsSection.empty();
    let name = nameInput.val();
    console.log('name: ' + name)
    let ingredient = ingredientInput.val();
    console.log('ingredient: ' + ingredient)
    let category = categoryInput.val(); 
    console.log('category: ' + category)
    let IDnums = []; 
    let numberOfResponses = numberInput.val();
    console.log(numberOfResponses);

    if (!name && !ingredient && !category) {
        console.warn('!name && !ingredient && !category')
        // COULD BE TURNED INTO MODAL, html #no-search-warning remove. 
        noSearchWarning.removeClass('hide'); 
        return; 
    } else {
        noSearchWarning.addClass('hide'); 
    if (name) {
        console.warn('name only'); 
        // get ids for first i results containing search name
        let response = await $.ajax({
         method: 'GET',
         url: getURLName(name)
        })
            for (let i = 0; i < numberOfResponses; i++) {
                if (response['drinks'] && response['drinks'][i] && response['drinks'][i]['idDrink']) {
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
                for (let i = 0; i < numberOfResponses; i++) {
                    if (response['drinks'] && response['drinks'][i] && response['drinks'][i]['idDrink']) {
                        IDnums.push(response['drinks'][i]['idDrink'])
                    }
                }
         } else if (category && !ingredient) {
            console.warn('category only')
             // id for search by category
             let response = await $.ajax({
                method: 'GET',
                url: `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`
            });
                for (let i = 0; i < numberOfResponses; i++) {
                    if (response['drinks'] && response['drinks'][i] && response['drinks'][i]['idDrink']) {
                        IDnums.push(response['drinks'][i]['idDrink'])
                    }
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
                    if (ingResponse['drinks'] && ingResponse['drinks'][i] && ingResponse['drinks'][i]['idDrink']) {
                        ingArray.push(ingResponse['drinks'][i]['idDrink']); 
                    }
                }
                console.log(ingArray)
            
            let catResponse = await $.ajax({
                method: 'GET',
                url: `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`
            });
                for (let i = 0; i < catResponse['drinks'].length; i++) {
                    if (catResponse['drinks'] && catResponse['drinks'][i] && catResponse['drinks'][i]['idDrink']) {
                        catArray.push(catResponse['drinks'][i]['idDrink']); 
                    }
                }
                console.log(catArray)

            ingArray.forEach(ingID => {
                if (catArray.find(catID => catID === ingID)) {
                    IDnums.push(ingID);
                }
            }) 
            if (IDnums.length > numberOfResponses) {
                IDnums = IDnums.splice(0,numberOfResponses - 1); 
            }
         } 
     }

    //  Info on page from this call
    if (IDnums.length !== 0) {
        IDnums.forEach((drinkID) => {
            newRowAjax(drinkID); 
          });
    } else {
        // behaviour for not matching search. Could be changed to modal
        resultsSection.html('<h2>Sorry, we couldn\'t find anything matching your search</h2>')
    }
    }
    clearSearchFunc(); 
})

// NUMBER OF RESULTS LIMITS
numberInput.on('keydown', (event) => {
    event.preventDefault(); 
    let keyNum = parseInt(event.key); 
    if (keyNum >= 5) {
        numberInput.val('5');
    } else if (keyNum <= 1) {
        numberInput.val('1'); 
    } else if (keyNum > 1 && keyNum < 5) {
        numberInput.val(keyNum); 
    } else {
        return; 
    }
}); 

// RANDOM CLICK LISTENER
const randomBtn = $('.random')
randomBtn.on('click', () => {
    resultsSection.empty();
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

    resultsSection.append(newRow);  
    clearSearchFunc(); 
   })
})

// CLEAR CLICK LISTENER
const clearResultsBtn = $('.clear-results')
clearResultsBtn.on('click', () => {
    resultsSection.empty(); 
})

// DISPLAY FAV BUTTONS
let renderFavBtn = () => {
    favouritesBar.empty(); 
    let IDArray = JSON.parse(localStorage.getItem('favouriteIDs'));

    if (IDArray) {
        IDArray.forEach(drink => {
            let newBtn = $('<button>');
            newBtn.attr('class', 'btn-primary'); // changed class to btn-primary instead of button btn-primary
            newBtn.attr('data-id', drink['storedID']); 
            newBtn.text(drink['storedName']); 
        
    
            favouritesBar.prepend(newBtn); 
        })
    }
}

// NEW STORAGE - NEW FAV BUTTON CLICK LISTENER
const favouritesBar = $('#favourites-bar')
resultsSection.on('click', (event) => {
    let clicked = $(event.target); 
    let newID = clicked.attr('data-id');
    let newName = clicked.attr('data-name'); 

    if (newID) {
    let localInfo = JSON.parse(localStorage.getItem('favouriteIDs')); 
    if (localInfo) {
        // prevent duplicates
        let duplicateIndex = 'NaN';
        localInfo.forEach((item, i) => {
            if (item['storedID'] === newID) {
                // index of duplicate in array
                duplicateIndex = i; 
            }
        })
        // move old button and move to left
        if (duplicateIndex !== 'NaN') {
            localInfo.splice(duplicateIndex, 1); 
         }
              // max of 5 favs
         if(localInfo.length >= 5) {
             // remove oldest button, make room for new one 
                 localInfo.shift(); 
             }
             localInfo.push({'storedID': newID, 'storedName': newName}); 
             localStorage.setItem('favouriteIDs', JSON.stringify(localInfo));   
         } else {
        let newStorage = [{'storedID': newID, 'storedName': newName}]; 
        localStorage.setItem('favouriteIDs', JSON.stringify(newStorage))
    }
    renderFavBtn(); 
}
})

// FAVOURITE BTN CLICK LISTENER
favouritesBar.on('click', event => {
    let button = $(event.target);

    if (button.attr('data-id')) {
        resultsSection.empty();
        newRowAjax(button.attr('data-id'))
    }
});

// CLEAR FAV CLICK LISTENER
const clearFavBtn = $('.clear-favourites');
clearFavBtn.on('click', () => {
    localStorage.removeItem('favouriteIDs');
    renderFavBtn(); 
})

// runs when page loads
renderFavBtn(); 
noSearchWarning.addClass('hide'); 