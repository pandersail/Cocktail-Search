const nameInput = $('#search-box-name'); 
const ingredientInput = $('#search-box-ingredient'); 
const categoryInput = $('#search-box-category');
const submitBtn = $('.submit-btn')

getURLFunc = () => {
    let queryURL; 
    const category = categoryInput.val();
    let name = nameInput.val();
    name = name.toLowerCase();  

    let ingredient = ingredientInput.val();
    ingredient = ingredient.toLowerCase();
    ingredient = ingredient[0].toUpperCase() + ingredient.slice(1)

    if (category) {
        queryURL = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=${category}`
    }
    if (name) {
        queryURL = `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${name}`
    }
    if (ingredient) {
        queryURL = `https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=${ingredient}`
    }
    return queryURL; 
}

submitBtn.on('click', (event) => {
    event.preventDefault(); 
    let queryURL = getURLFunc(); 
})