!function(){var t={input:document.querySelector("#input"),form:document.querySelector("#form"),button:document.querySelector("#button")};t.form.addEventListener("submit",(function(n){n.preventDefault();var e=t.input.value;fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?i=".concat(e)).then((function(t){return t.json()})).then((function(t){return console.log(t)})).catch((function(t){return console.log(t)}))}))}();
//# sourceMappingURL=index.c8879582.js.map
