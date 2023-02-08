
$.ajax({
    method: 'GET',
    url: 'https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=Gin'
}).then(response => {
    console.log(response)
})