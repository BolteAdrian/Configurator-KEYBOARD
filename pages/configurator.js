//load data from a JSON file
function loadData(callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open("GET", "./../configurator.json", true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

//MAIN function
function init() {
  loadData(function (response) {
    // Parse JSON string into object
    const data = JSON.parse(response);

    document.getElementById("title").innerHTML = data.title;
    var container_options = document.getElementsByClassName(
      "product_container__options"
    );
    var imgContent = document.getElementsByClassName(
      "product_container__image"
    );

    //create a label for the selected items
    const selectedItemLabel = document.createElement("label");
    selectedItemLabel.setAttribute("class", "selected_item");

    let sum = 0; //variable for price
    const optionsCheckBox = []; //array for checkbox items
    const optionsRadio = []; //array for radio button items
    let saved_input = 0; //last input clicked

    //create all the attributes
    for (i = 0; i < data.attributes.length; i++) {
      var item = document.createElement("div");
      item.setAttribute("class", "item close");
      var header = document.createElement("span");
      header.setAttribute("class", "header");
      var itemHeader = document.createElement("h2");
      itemHeader.setAttribute("class", "item_heading");
      var ulist = document.createElement("ul");
      ulist.setAttribute("class", "item_content");

      container_options[0].appendChild(item);
      item.appendChild(header);
      item.appendChild(ulist);
      header.appendChild(itemHeader);

      itemHeader.innerHTML = data.attributes[i].name;

      // if the attribute has an icon we use it, if not then we let some space for design
      if (data.attributes[i].icon != "null") {
        var itemIcon = document.createElement("img");
        itemIcon.setAttribute("src", "./../images/" + data.attributes[i].icon);
        itemIcon.setAttribute("alt", "picture");
        itemIcon.setAttribute("width", "40");
        itemIcon.setAttribute("height", "40");
        itemIcon.style.paddingRight = "0.5rem";
        header.prepend(itemIcon);
      } else {
        var space = document.createElement("span");
        space.style.paddingRight = "3rem";
        header.prepend(space);
      }

      //create all the variants for attributes
      data.attributes[i].variants.forEach((element) => {
        //Item elements
        const li = document.createElement("li");
        li.setAttribute("class", "input_content");
        const a = document.createElement("a");
        const input = document.createElement("input");
        const labelName = document.createElement("label");
        const labelPrice = document.createElement("label");
        const labelSpan = document.createElement("span");
        const empty_stock = document.createElement("span");

        if (element.picture != "null") {
          const img = document.createElement("img");
          img.setAttribute("src", "./../images/" + element.picture);
          img.setAttribute("alt", "picture");
          img.setAttribute("width", "528");
          img.setAttribute("height", "528");
          img.setAttribute("name", element.id_attribute);
          img.setAttribute("id_input", element.id);
          img.style.position = "absolute";

          //the first item will be selected when we open this page
          if (element.id == 1 && element.id_attribute == 1) {
            img.style.display = "block";
          } else if (element.gift == true) {
            img.style.display = "block";
          } else {
            img.style.display = "none";
          }
          imgContent.item(0).appendChild(img);
        }

        //item with radio buttons
        if (data.attributes[i].type == "radio_button") {
          input.setAttribute("type", "radio");
          input.setAttribute("id", element.name);
          input.setAttribute("name", element.id_attribute);
          input.setAttribute("value", element.price);
          input.setAttribute("picture", element.picture);
          input.setAttribute("id_input", element.id);
console.log(element.id_attribute);
          if (element.icon != "null") {
            input.style.backgroundImage = `url(${
              "./../images/" + element.icon
            })`;
          }

          labelName.setAttribute("for", element.name);
          labelName.setAttribute("class", "button_label");
        } else {
          //item with checkboxs
          input.setAttribute("type", "checkbox");
          input.setAttribute("id", element.name);
          input.setAttribute("name", element.id_attribute);
          input.setAttribute("value", element.price);
          input.setAttribute("picture", element.picture);
          labelName.setAttribute("class", "button_label");
        }
      
        //if the variants doesnt have a price we will not show that part
        if (element.price !== 0) {
          labelPrice.setAttribute("for", element.name);
          labelPrice.setAttribute("class", "button_label");
          labelPrice.style.color = "black";
          labelPrice.innerHTML = element.price + ".00 LEI";
          labelSpan.appendChild(labelPrice);
        }

        //if the variants are empty we disable them
        if (element.stock == "0") {
          empty_stock.setAttribute("for", element.name);
          empty_stock.setAttribute("class", "out_of_stock");
          empty_stock.innerHTML = "Stoc epuizat";
          li.appendChild(empty_stock);
          input.setAttribute("disabled", "");
        }
        //label for variant name
        labelSpan.prepend(labelName);
        labelName.innerHTML = element.name;

        input.innerHTML = element.name;
      
        //the first item will be selected when we open this page
        if (element.id == 1 && element.id_attribute == 1) {
          a.setAttribute("class", "visited");
          li.setAttribute("class", "input_content active");
          li.append(a);
          a.appendChild(input);
          a.appendChild(labelSpan);

          optionsRadio.push({
            key: element.id_attribute,
            name: element.name,
            value: element.price,
          });
        } else if (element.gift == true) {
          //this variants are included in kit and can t be deselected
          input.setAttribute("disabled", "");
          a.setAttribute("class", "visited");
          li.setAttribute("class", "input_content active");
          li.append(a);
          a.appendChild(input);
          a.appendChild(labelSpan);

          //add the variant in array
          optionsCheckBox.push({
            key: element.id_attribute,
            name: element.name,
            value: element.price,
          });
        } else {
          li.append(a);
          a.appendChild(input);
          a.appendChild(labelSpan);
        }
      
        //add all the variants in the list (item)
        ulist.appendChild(li);
      });

      //if an item header is clicked then we activate toggleItem
      itemHeader.addEventListener("click", toggleItem, false);
    }

    //set name to close or open
    function toggleItem() {
      var itemClass = this.parentNode.parentNode.className;

      var items = document
        .querySelector(".product_container__options")
        .querySelectorAll("div");

      for (i = 0; i < items.length; i++) {
        items[i].className = "item close";
      }

      if (itemClass == "item close") {
        this.parentNode.parentNode.className = "Item open";
      }
    }

    //when we click an input this functionm will be called
    document
      .querySelector(".product_container__options")
      .addEventListener("click", (e) => {
        const qty = document.getElementById("quantity");
        const priceLabel = document.getElementById("price_label");
        const added_cost = document.getElementById("added_cost");
        added_cost.style.fontSize = "16px";
        //if the variant is an radio button
        if (e.target.matches("input")) {
          if (e.target.type == "radio") {
            var sectionsA = document.querySelectorAll("a");
            var inputValue = e.target.value;
            var inputName = e.target.id;
            var id_attribute = e.target.name;
            var pic = e.target.getAttribute("picture");
     
            //if we click another options the last one will be deleted
            sectionsA.forEach((element) => {
              element.classList.remove("visited");
              element.parentNode.classList.remove("active");
              // we search to see if we have a similar atrribute in this array
              if (optionsRadio.some((item) => item.key == id_attribute)) {
                //if we have then we will delete them from final price
                optionsRadio.map((item) => {
                  if (item.key == id_attribute) {
                    sum -= Number(item.value) * Number(qty.value);
                    priceLabel.innerHTML = "COSTUL CONFIGURATIEI:";
                    added_cost.innerHTML = "+" + "0.00 lei";
                  }
                });

                //we take that attribute out of this array
                optionsRadio.splice(
                  optionsRadio.findIndex((item) => item.key == id_attribute),
                  1
                );
              }
            });

            var sect = e.target.parentNode.parentNode.querySelector("input");

            //Select all the pictures
            var images =
              e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
                .querySelector(".product_container__image")
                .querySelectorAll("img");

            //select the picture of the current variant
            var selected_img = "/images/" + pic;

            //if we want to delete an variant that we selected alone
            if (sect.getAttribute("id_input") == saved_input) {
              e.target.parentNode.classList.remove("visited");
              e.target.parentNode.parentNode.classList.remove("active");

              saved_input = 0; //id of the last selected input

              //same function to delete the element
              if (
                optionsRadio.some((item) => item.key == id_attribute) &&
                id_attribute != 1
              ) {
                optionsRadio.map((item) => {
                  if (item.key == id_attribute) {
                    sum -= Number(item.value) * Number(qty.value);
                  }
                });
                optionsRadio.splice(
                  optionsRadio.findIndex((item) => item.key == id_attribute),
                  1
                );
              }
              //disable the img of the deleted variant
              images.forEach((element) => {
                if (element.name == id_attribute && id_attribute != 1) {
                  if (element.src.includes(selected_img)) {
                    element.style.display = "none";
                  }
                }
              });

              //selected label is null
              selectedItemLabel.innerHTML = "";
            } else {
              //select a new variant
              e.target.parentNode.classList.add("visited");
              e.target.parentNode.parentNode.classList.add("active");

              saved_input = e.target.parentNode.parentNode
                .querySelector("input")
                .getAttribute("id_input");

              //we add the variant in array
              optionsRadio.push({
                key: id_attribute,
                name: inputName,
                value: inputValue,
              });

              selectedItemLabel.innerHTML = inputName;

              e.target.parentNode.parentNode.parentNode.parentNode
                .querySelector(".header")
                .appendChild(selectedItemLabel);

              sum += Number(inputValue) * Number(qty.value);
              priceLabel.innerHTML = "COSTUL CONFIGURATIEI:";
              added_cost.innerHTML =
                "+" + Number(inputValue) * Number(qty.value) + ".00 lei";

              //add a img for the selected variant
              images.forEach((element) => {
                if (element.name == id_attribute) {
                  if (element.src.includes(selected_img)) {
                    element.style.display = "block";
                  } else {
                    element.style.display = "none";
                  }
                }
              });
            }
            console.log(optionsRadio);
          } else if (e.target.type === "checkbox") {
            //if the variant is an checkbox
            //if we click on an already selected element then we deselect that element
            if (e.target.parentNode.classList[0] === "visited") {
              e.target.parentNode.classList.remove("visited");
              e.target.parentNode.parentNode.classList.remove("active");
              var inputName = e.target.id;

              var id_attribute = e.target.name;
              var pic = e.target.getAttribute("picture");

              //the deselected element will be take off from the array
              console.log(
                optionsCheckBox.splice(
                  optionsCheckBox.findIndex((item) => item.name == inputName),
                  1
                )
              );

              //the deselected element will be removed from the label
              selectedItemLabel.innerHTML = "";

              //set the new label with current selected variants
              optionsCheckBox.forEach((element) => {
                if (element.key == id_attribute) {
                  selectedItemLabel.innerHTML += element.name + ", ";
                }
              });

              var inputValue = e.target.value;
              sum -= inputValue * Number(qty.value);

              priceLabel.innerHTML = "COSTUL CONFIGURATIEI:";
              added_cost.innerHTML = "+" + "0.00 lei";
              //select all the pictures
              var images =
                e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
                  .querySelector(".product_container__image")
                  .querySelectorAll("img");
              //select the picture of the current variant
              var selected_img = "/images/" + pic;

              //the picture for the deselected element will be removed
              images.forEach((element) => {
                if (element.name == id_attribute) {
                  if (element.src.includes(selected_img)) {
                    element.style.display = "none";
                  }
                }
              });
            } else {
              //select the variant
              e.target.parentNode.classList.add("visited");
              e.target.parentNode.parentNode.classList.add("active");
              var inputValue = e.target.value;
              var inputName = e.target.id;

              var id_attribute = e.target.name;
              var pic = e.target.getAttribute("picture");

              //add the variant in array
              optionsCheckBox.push({
                key: id_attribute,
                name: inputName,
                value: inputValue,
              });

              //the deselected element will be removed from the label
              selectedItemLabel.innerHTML = "";

              //set the new label with current selected variants
              optionsCheckBox.forEach((element) => {
                if (element.key == id_attribute) {
                  selectedItemLabel.innerHTML += element.name + ", ";
                }
              });

              e.target.parentNode.parentNode.parentNode.parentNode
                .querySelector(".header")
                .appendChild(selectedItemLabel);

              //add the variant cost to the final sum
              sum += Number(inputValue) * Number(qty.value);
              priceLabel.innerHTML = "COSTUL CONFIGURATIEI:";
              added_cost.innerHTML =
                "+" + Number(inputValue) * Number(qty.value) + ".00 lei";

              //select all the pictures
              var images =
                e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
                  .querySelector(".product_container__image")
                  .querySelectorAll("img");

              //select the picture of the current variant
              var selected_img = "/images/" + pic;

              //we activate the image of the selected variant
              images.forEach((element) => {
                if (element.name == id_attribute) {
                  if (element.src.includes(selected_img)) {
                    element.style.display = "block";
                  }
                }
              });
            }

            console.log(optionsCheckBox);
          }
          //set final price
          document.getElementById("final_price").innerHTML = sum + ".00 lei";
        }
      });

    const qty = document.getElementById("quantity"); //product quantity

    //this function is activated when we want to change the quantity
    document.querySelector(".quantity-input").addEventListener("click", (e) => {
      //lower qty
      if (e.target.matches(".quantity-input-minus")) {
        if (qty.value > 1) {
          sum = sum / Number(qty.value);
          qty.value--;
          sum = sum * Number(qty.value);
        }
      } else if (e.target.matches(".quantity-input-plus")) {
        //more qty
        sum = sum / Number(qty.value);
        qty.value++;
        sum = sum * Number(qty.value);
      }
      // final price
      document.getElementById("final_price").innerHTML = sum + ".00 lei";
    });

    //this function is activated when we want to add to cart the product
    document.querySelector(".add_to_cart").addEventListener("click", (e) => {
      const product = [];
      if (
        typeof optionsCheckBox !== "undefined" &&
        optionsCheckBox.length > 0
      ) {
        console.log("Produsul a fost salvat");

        product.push(optionsRadio);
        product.push(optionsCheckBox);
        product.push(qty.value);

        console.log(product);
      } else {
        console.log("ERROR: The product is not valid !");
      }
    });
  });
}

init();
