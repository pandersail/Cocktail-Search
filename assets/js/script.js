const nameInput = $('#search-box-name'); 
const ingredientInput = $('#search-box-ingredient'); 
const categoryInput = $('#search-box-category');
const submitBtn = $('.submit-btn')

getURLname = (name) => {
    let name = nameInput.val();
    name = name.toLowerCase(); 
    return `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`
    // gives full info about drink
}
getURLingredient = (ingredient) => {
    let ingredient = ingredientInput.val();
    ingredient = ingredient.toLowerCase();
    ingredient = ingredient[0].toUpperCase() + ingredient.slice(1)
    // gives name, jpg src, and id
}
getURLcategory = (category) => {
    return `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`; 
    // gives name, jpg src, and id
}
getURLID = (ID) => {
    return `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${ID}`
    // gives full info about drink
}

const addImageFunc = (newRow, drink) => {
     let imageCol = $('<div>')
    imageCol.attr('class', 'col col-lg-4')
    imageCol.html(`<img src=${drink['strDrinkThumb']}></img>`)
    newRow.append(imageCol)
}
const addIngredientFunc = (newRow, drink) => {
    let ingredientCol = $('<div>');
    ingredientCol.attr('class', 'col col-md-6 col-lg-4');
    newRow.append(ingredientCol)
}
const addRecipeFucn = (newRow, drink) => {
    let recipeCol = $('<div>'); 
    recipeCol.attr('class', 'col col-md-6 col-lg-4');
    newRow.append(recipeCol)
}

submitBtn.on('click', (event) => {
    event.preventDefault(); 
    let name = nameInput.val();
    let ingredient = ingredientInput.val();
    let category = categoryInput.val(); 

    if (name) {
       let queryURL =  getURLname(name); 
    } else {
        if (ingredient && !category) {
           let queryURL = getURLingredient(ingredient); 
        } else if (category && !ingredient) {
           let queryURL = getURLcategory(category)
        } else (catgory && ingredient) {

        }
    }

    $.ajax({
        method: 'GET',
        url: queryURL
    }).then(response => {
        console.log(response)
        for (let i = 0; i < 3; i++) {
            let drink = response['drinks'][i]; 
            console.log(drink)
            let newRow = $('<div>'); 
            newRow.attr('class', 'row');
            
            addImageFunc(newRow, drink);
            addIngredientFunc(newRow, drink);
            addRecipeFucn(newRow, drink); 

            $('.results').append(newRow)
        }
    })
})