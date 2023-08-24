//[1] get total
//[2] create product
//[3] save in local storage
//[4] clear inputs
//[5] read
//[6] delete
//[7] clean data
//[8] count
//[9] update
//[10] search


// -- [1] To Get The Input Elements --
let title = document.getElementById("title")
let price = document.getElementById("price")
let taxes = document.getElementById("taxes")
let ads = document.getElementById("ads")
let discount = document.getElementById("discount")
let total = document.getElementById("total")
let count = document.getElementById("count")
let category = document.getElementById("category")
let submit = document.getElementById("submit")

// Create The Mood That Check Whether I Will Create A Product Or Update It
let mood = 'create'

// The Tmp That Hold The Index Of File That Will Be Updated
let tmp;

// Function To Get Total
function getTotal() {
    if (price.value != "") {
        let result = (+price.value + +taxes.value + +ads.value) - +discount.value
        total.innerHTML = result
        total.style.backgroundColor = "#2ead66"
    } else {
        total.innerHTML = "0"
        total.style.backgroundColor = "#ff4500"
    }
}
price.addEventListener("keyup", getTotal)
taxes.addEventListener("keyup", getTotal)
ads.addEventListener("keyup", getTotal)
discount.addEventListener("keyup", getTotal)


// -- Function To Take Values --

// The Array To Store Object Of Products
let dataPro;

// And Check If It's Empty Or Not
if (localStorage.products != null) {
    dataPro = JSON.parse(localStorage.products)
} else {
    dataPro = []
}

let warning = document.querySelector(".input > span")
// -- [2] The Main Function Of Creating Product --
submit.addEventListener("click", () => {
    if (title.value !== '' && price.value !== '' && category.value !== '' && count.value <= 100) {
        
        // Delete Warning Element
        warning.style.display = 'none'
        warning.classList.remove("flash")

        // Create The Object Product
        let newPro = {
            title : title.value,
            price : price.value,
            taxes : taxes.value | "0",
            ads : ads.value | "0",
            discount : discount.value | "0",
            total: total.innerHTML,
            count : count.value,
            category : category.value
        }

        if (mood === 'create') {
            // [8] If We Add More Than One Product
            if (newPro.count > 1) {
                for (let i=0; i<newPro.count; i++) {
                    dataPro.push(newPro)
                    console.log(newPro.count)
                }
            } else {
                // If One Element
                dataPro.push(newPro)
            } 
        } else {
            // If Mood Is Update, only update date not create new one
            dataPro[tmp] = newPro;
            mood = 'create'
            submit.querySelector("span").innerHTML = "Create"
            count.style.display = 'block'
        }



    
        // -- [3] To Set Array Of Products In Local Storage --
        localStorage.setItem("products", JSON.stringify(dataPro))
    
        // To Clear The Inputs
        clearData()
    
        // To Show Data
        showData()

    } else {
        // Add Warning Element
        warning.style.display = 'block'
        warning.classList.add("flash")
        if (count.value <= 100) {
            warning.innerHTML = "Please fill out the form"
        } else {
            warning.innerHTML = "Maximum 100 Product"
        }
    }
})



// -- [4] Function To Clear Inputs After Submit Data --
function clearData() {
    let myInputs = Array.from(document.querySelectorAll("input"))
    myInputs.splice(-1)
    myInputs.forEach(input => {
        input.value = ''
    })
    total.innerHTML = '0'
    total.style.backgroundColor = "#ff4500"
}


// -- [5] Function To Read The Data On The Table
function showData() {
    let table = ''

    // To Loop On The Item In Aray
    for (let i = 0; i < dataPro.length; i++) {
        table += `
        <tr>
            <td>${i + 1}</td>
            <td>${dataPro[i].title}</td>
            <td>${dataPro[i].price}</td>
            <td>${dataPro[i].taxes}</td>
            <td>${dataPro[i].ads}</td>
            <td>${dataPro[i].discount}</td>
            <td>${dataPro[i].total}</td>
            <td>${dataPro[i].category}</td>
            <td><button id="searchTitle" onclick=updatePro(${i})><span>update</span></button></td>
            <td><button id="searchTitle" onclick=deletePro(${i})><span>delete</span></button></td>
        </tr>
    `
    }
    document.getElementById("tbody").innerHTML = table

    let btnDelete = document.querySelector(".delete-all")
    if (dataPro.length >= 1) {
        btnDelete.innerHTML = `
            <button id="del-all" onclick=deleteAll()><span>Delete All (${dataPro.length})</span></button>
        `
    } else {
        btnDelete.innerHTML = ``
    }
}
showData()


// -- [6] The Function Of Delete One Product Form Table -- 
function deletePro(i) {
    dataPro.splice(i, 1)
    localStorage.setItem("products", JSON.stringify(dataPro))
    showData()
}

// [7] For Delete All Products
function deleteAll() {
    // Make The Main Array Empty
    dataPro = []
    // Also Clear Local Storage Because (dataPro) Will Take It's Data After Reload
    localStorage.products = ""
    // Show The Data
    showData()
}

// -- [9] For Update Element In The Array
function updatePro(i) {
    title.value = dataPro[i].title
    price.value = dataPro[i].price
    taxes.value = dataPro[i].taxes
    ads.value = dataPro[i].ads
    discount.value = dataPro[i].discount
    getTotal()
    count.style.display = 'none'
    category.value = dataPro[i].category
    submit.querySelector("span").innerHTML = 'Update'

    // Change The Mood To Updated
    mood = 'update'

    // Make The tmp variable hold the index of updated product
    tmp = i

    scroll({
        top:0,
        behavior:"smooth",
    })
}

// -- [10] Search For Product --

// let the main search mood is title
let searchMood = 'title'

function getSearchMood(id) {
    console.log(id)

    let search = document.getElementById("search")
    if (id == 'searchTitle') {
        searchMood = 'title'
    } else {
        searchMood = "category"
    }
    search.placeholder = `Search By ${searchMood[0].toUpperCase()}${searchMood.slice(1)}`
    search.focus()
    search.value = ''
    showData()
}

// The Function For Search Data
function searchData(value) {
    
    let table = ''

    if (searchMood == 'title') {

        for (let i=0; i<dataPro.length; i++) {
            if (dataPro[i].title.toLowerCase().includes(value.toLowerCase())) {
                table += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${dataPro[i].title}</td>
                    <td>${dataPro[i].price}</td>
                    <td>${dataPro[i].taxes}</td>
                    <td>${dataPro[i].ads}</td>
                    <td>${dataPro[i].discount}</td>
                    <td>${dataPro[i].total}</td>
                    <td>${dataPro[i].category}</td>
                    <td><button id="searchTitle" onclick=updatePro(${i})><span>update</span></button></td>
                    <td><button id="searchTitle" onclick=deletePro(${i})><span>delete</span></button></td>
                </tr>
            `
            }
        }
    } else {
        for (let i=0; i<dataPro.length; i++) {
            if (dataPro[i].category.toLowerCase().includes(value.toLowerCase())) {
                table += `
                <tr>
                    <td>${i + 1}</td>
                    <td>${dataPro[i].title}</td>
                    <td>${dataPro[i].price}</td>
                    <td>${dataPro[i].taxes}</td>
                    <td>${dataPro[i].ads}</td>
                    <td>${dataPro[i].discount}</td>
                    <td>${dataPro[i].total}</td>
                    <td>${dataPro[i].category}</td>
                    <td><button id="searchTitle" onclick=updatePro(${i})><span>update</span></button></td>
                    <td><button id="searchTitle" onclick=deletePro(${i})><span>delete</span></button></td>
                </tr>
            `
            }
        }
    }
    document.getElementById("tbody").innerHTML = table
}