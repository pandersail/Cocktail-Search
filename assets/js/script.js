const nameInput = $('#search-box-name'); 
const ingredientInput = $('#search-box-ingredient'); 
const categoryInput = $('#search-box-category');
const submitBtn = $('.submit-btn')

getURLFunc = () => {
    let queryURL; 
    const category = categoryInput.val();
    let name = nameInput.val();
    let ingredient = ingredientInput.val();

    if (category) {
        queryURL = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`
    }
    if (name) {
        name = name.toLowerCase(); 
        queryURL = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`
    }
    if (ingredient) {
        ingredient = ingredient.toLowerCase();
        ingredient = ingredient[0].toUpperCase() + ingredient.slice(1)
        queryURL = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient}`
    }

    return queryURL; 
}

submitBtn.on('click', (event) => {
    event.preventDefault(); 
    let queryURL = getURLFunc(); 

    $.ajax({
        method: 'GET',
        url: queryURL
    }).then(response => {
        for (let i = 0; i < 3; i++) {
            let drink = response['drinks'][i]; 
            let newRow = $('<div>'); 
            newRow.attr('class', 'row'); 

            let imageCol = $('<div>')
            imageCol.attr('class', 'col col-lg-4')
            let ingredientCol = $('<div>')
            ingredientCol.attr('class', 'col col-md-6 col-lg-4')
            let recipeCol = ingredientCol; 

            imageCol.html(`<img src=${drink['strDrinkThumb']}></img>`)
            console.log(drink)
            ingredientCol.html(``)
            recipeCol.html(``)

            newRow.append(imageCol)
            newRow.append(ingredientCol)
            newRow.append(recipeCol)

            $('.results').append(newRow)
        }
    })
})