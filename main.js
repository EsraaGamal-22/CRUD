let title = document.getElementById("title");
let price = document.getElementById("price");
let taxes = document.getElementById("taxes");
let ads = document.getElementById("ads");
let discount = document.getElementById("discount");
let total = document.getElementById("total");
let count = document.getElementById("count");
let category = document.getElementById("category");
let btn_create = document.getElementById("btn-create");
let table_container = document.getElementsByClassName("b-table")[0];
let delete_all = document.getElementById("delete-all");
let mood_app = "create";
let index_update;
//-- get total
function clacTotal() {
  let result;
  if (price.value !== "") {
    result =
      Number(price.value) +
      Number(ads.value) +
      Number(taxes.value) -
      Number(discount.value);
    total.innerText = `total: ${result}`;
    total.style.backgroundColor = "green";
  } else {
    total.innerHTML = "total:";
    total.style.backgroundColor = "red";
  }
}

//-- create product

let dataPro;
if (localStorage.product != null) {
  dataPro = JSON.parse(localStorage.product);
} else {
  dataPro = [];
}

btn_create.onclick = function () {
  let newPro = {
    title: title.value.toLowerCase(),
    price: price.value,
    taxes: taxes.value,
    ads: ads.value,
    discount: discount.value,
    total: total.innerText.slice(7),
    count: count.value,
    category: category.value.toLowerCase(),
  };
  

 //-- clean data: should fill all inputs to do operation(should no have empty input) and count <100
 if(title.value !='' && price.value !='' && category.value !='' && newPro.count<100)
 {
  if (mood_app === "create") {
    //-- count operation: can create number of product based on count
    if (newPro.count > 1) {
      for (let i = 0; i < newPro.count; i++) {
        dataPro.push(newPro);
      }
    } else {
      dataPro.push(newPro);
      console.log("after add obj after click: "+ dataPro.length);
    }
    //document.getElementById("delete").disabled="false";
    document.getElementsByClassName('btn-delete').disabled=false;

  }
  // in mood update
  else {
    dataPro[index_update] = newPro;
    mood_app = "create";
    btn_create.innerHTML = "Create";
    count.style.display = "block";
  }
    //-- clear input after click on create btn
    clearData();

 }
  
  //-- save data into local storage
  localStorage.setItem("product", JSON.stringify(dataPro));
  readData();
};

//-- after click on create should clear the inputs from data
function clearData() {
  title.value = "";
  price.value = "";
  taxes.value = "";
  ads.value = "";
  discount.value = "";
  total.innerText = "total:";
  total.style.backgroundColor = "red";
  count.value = "";
  category.value = "";
}

//-- read operation: after click on create should show the data in the table

function readData() {
  //console.log("in read fun datapro: "+ dataPro.length);
  /*for (let i = 0; i < data.length; i++) {
    let obj = data[i];
    let keys_obj = Object.keys(obj);
    let row_table = document.createElement("tr");
    let cell_table3 = document.createElement("td");
    cell_table3.appendChild(document.createTextNode(i+1));
    row_table.appendChild(cell_table3);
    for (let j = 0; j < keys_obj.length; j++) {
      let cell_table = document.createElement("td");
      let content = document.createTextNode(obj[keys_obj[j]]);
      cell_table.appendChild(content);
      row_table.appendChild(cell_table);
    }
    let btn_update = document.createElement("button");
    let cell_table1 = document.createElement("td");
    btn_update.id = "update";
    btn_update.innerText = "update";
    btn_update.classList.add("btn", "btn-table");
    cell_table1.appendChild(btn_update);
    row_table.appendChild(cell_table1);

    let btn_delete = document.createElement("button");
    let row_table2 = document.createElement("tr");
    let cell_table2 = document.createElement("td");
    btn_delete.id = "delete";
    btn_delete.innerText = "delete";
    btn_delete.classList.add("btn", "btn-table");
    cell_table2.appendChild(btn_delete);
    row_table.appendChild(cell_table2);
    table_container.appendChild(row_table);
  }*/
  // -- another solu:
  clacTotal();
  let table = "";
  for (let i = 0; i < dataPro.length; i++) {
    console.log(i);

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
    <td><button class="btn btn-table btn-update" id="update" onclick="updateItem(${i})">update</button></td>
    <td><button class="btn btn-table btn-delete" id="delete"onclick="deleteItem(${i})">delete</button></td>
  </tr>
    `;
  }
  document.getElementById("tbody").innerHTML = table;

  // show the button of delete all when read the data
  if (dataPro.length > 0) {
    delete_all.classList.remove("hide");
    delete_all.innerText = `Delete All  (${dataPro.length})`;
  }
}
readData();

//-- delete one item when press on delete btn
function deleteItem(item) {
  // delete item from array
  dataPro.splice(item, 1);
  // delete from local storage
  localStorage.product = JSON.stringify(dataPro);
  readData();
}

//-- delete all can delete one product or all product
function deleteAllItems() {
  localStorage.clear();
  dataPro.splice(0); // delete item from index 0 to end of array
  delete_all.classList.add("hide");
  readData();
}

//-- update operation
function updateItem(item) {
  console.log(item);
  title.value = dataPro[item].title;
  price.value = dataPro[item].price;
  taxes.value = dataPro[item].taxes;
  ads.value = dataPro[item].ads;
  discount.value = dataPro[item].discount;
  clacTotal();
  count.style.display = "none";
  category.value = dataPro[item].category;
  btn_create.innerHTML = "Update";
  mood_app = "update";
  index_update = item;
  scroll({
    top: 0,
    behavior: "smooth",
  });
  console.log(document.getElementById("delete"));
  document.getElementsByClassName('btn-delete')[item].disabled=true;
  document.getElementsByClassName('btn-delete')[item].style.cursor="not-allowed";

 /* document.getElementById("delete").disabled="true";
  document.getElementById("delete").style.cursor="not-allowed";*/

}

//-- search operation
let searchMood = "title";
function getSearchMood(mood) {
  let searchInput = document.getElementById("btn-search");
  if (mood == "search-title") {
    searchMood = "title";
  } else {
    searchMood = "category";
  }
  searchInput.placeholder = "Search By " + searchMood;
  searchInput.focus();
  // will remove any value inside the input when press on any btn of them
  searchInput.value = "";
  // will show data if user enter value then press on btn then show all data
  readData();
}
function searchData(inputValue) {
  let table = "";
    for (let i = 0; i < dataPro.length; i++) {
      if (searchMood == "title") {
          if (dataPro[i].title.includes(inputValue.toLowerCase())) {
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
        <td><button class="btn btn-table" id="update" onclick="updateItem(${i})">update</button></td>
        <td><button class="btn btn-table" id="delete"onclick="deleteItem(${i})">delete</button></td>
      </tr>
        `;
          }
 
      } else {
    
          if (dataPro[i].category.includes(inputValue.toLowerCase())) {
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
        <td><button class="btn btn-table" id="update" onclick="updateItem(${i})">update</button></td>
        <td><button class="btn btn-table" id="delete"onclick="deleteItem(${i})">delete</button></td>
      </tr>
        `;
          }
      
      }

    }
  document.getElementById("tbody").innerHTML = table;
}



