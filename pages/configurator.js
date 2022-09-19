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

function init() {
  loadData(function (response) {
    // Parse JSON string into object
    const data = JSON.parse(response);
    document.getElementById("title").innerHTML = data.title;

    var item = document.getElementsByClassName("item");
    var header = document.getElementsByClassName("header");
    var itemHeader = document.getElementsByClassName("item_heading");
    var ulist = document.getElementsByClassName("item_content");
    var imgContent = document.getElementsByClassName(
      "product_container__image"
    );

    const selectedItemLabel = document.createElement("label");
    selectedItemLabel.setAttribute("class", "selected_item");

    for (i = 0; i < itemHeader.length; i++) {
      itemHeader[i].innerHTML = data.attributes[i].name;

      if (data.attributes[i].icon != "null") {
        var itemIcon = document.createElement("img");
        itemIcon.setAttribute("src", "./../images/" + data.attributes[i].icon);
        itemIcon.setAttribute("alt", "picture");
        itemIcon.setAttribute("width", "40");
        itemIcon.setAttribute("height", "40");
        itemIcon.style.paddingRight = "0.5rem";
        header[i].prepend(itemIcon);
      } else {
        var space = document.createElement("span");
        space.style.paddingRight = "3rem";
        header[i].prepend(space);
      }
    }

    for (i = 0; i < itemHeader.length; i++) {
      data.attributes[i].variants.forEach((element) => {
        const li = document.createElement("li");

        const a = document.createElement("a");
        a.setAttribute("href", "#");

        const input = document.createElement("input");
        const labelName = document.createElement("label");
        const labelPrice = document.createElement("label");
        const labelSpan = document.createElement("span");
        const empty_stock = document.createElement("span");

        li.setAttribute("class", "input_content");

        if (element.picture != "null") {
          const img = document.createElement("img");
          img.setAttribute("src", "./../images/" + element.picture);
          img.setAttribute("alt", "picture");
          img.setAttribute("width", "528");
          img.setAttribute("height", "528");
          img.setAttribute("name", element.id_attribute);
          img.setAttribute("id_input", element.id);
          img.style.position = "absolute";

          //tentativa

          if (element.id == 1 && element.id_attribute == 1) {
            img.style.display = "block";
          } else {
            img.style.display = "none";
          }

          imgContent.item(0).appendChild(img);
        }

        if (data.attributes[i].type == "radio_button") {
          input.setAttribute("type", "radio");
          input.setAttribute("id", element.name);
          input.setAttribute("name", element.id_attribute);
          input.setAttribute("value", element.price);
          input.setAttribute("picture", element.picture);
          input.setAttribute("id_input", element.id);
          input.style.backgroundImage = `url(${"./../images/" + element.icon})`;

          labelName.setAttribute("for", element.name);
          labelName.setAttribute("class", "radio_button__message");
        } else {
          input.setAttribute("type", "checkbox");
          input.setAttribute("id", element.name);
          input.setAttribute("value", element.price);
          labelName.setAttribute("class", "radio_button__message");
          input.setAttribute("picture", element.picture);
          input.setAttribute("name", element.id_attribute);
        }

        if (element.price !== 0) {
          labelPrice.setAttribute("for", element.name);
          labelPrice.setAttribute("class", "radio_button__message");
          labelPrice.style.color = "black";
          labelPrice.innerHTML = element.price + ".00 LEI";
          labelSpan.appendChild(labelPrice);
        }

        if (element.stock == "0") {
          empty_stock.setAttribute("for", element.name);
          empty_stock.setAttribute("class", "out_of_stock");
          empty_stock.innerHTML = "Stoc epuizat";
          li.appendChild(empty_stock);
          input.setAttribute("disabled", "");
        }

        labelSpan.prepend(labelName);
        labelName.innerHTML = element.name;

        input.innerHTML = element.name;

        //in work
        if (element.id == 1 && element.id_attribute == 1) {
          a.setAttribute("class", "visited");
          li.setAttribute("class", "input_content active");
          li.append(a);
          a.appendChild(input);
          a.appendChild(labelSpan);
        } else {
          li.append(a);
          a.appendChild(input);
          a.appendChild(labelSpan);
        }

        ulist[i].appendChild(li);
      });
    }

    for (i = 0; i < itemHeader.length; i++) {
      itemHeader[i].addEventListener("click", toggleItem, false);
    }

    function toggleItem() {
      var itemClass = this.parentNode.parentNode.className;
      for (i = 0; i < item.length; i++) {
        item[i].className = "item close";
        // item[i].setAttribute("disabled", "");
      }
      if (itemClass == "item close") {
        this.parentNode.parentNode.className = "Item open";
        // this.parentNode.setAttribute("enabled", "");
      }
    }

    let sum = 0;
    const optionsCheckBox = [];
    const optionsRadio = [];
    var saved_input = 0;

    document
      .querySelector(".product_container__options")
      .addEventListener("click", (e) => {
        const qty = document.getElementById("quantity_6322c048d0003");
        const priceLabel = document.getElementById("price_label");
        const price = document.getElementById("price");

        if (e.target.matches("input")) {
          if (e.target.type == "radio") {
            var sectionsA = document.querySelectorAll("a");
            var inputValue = e.target.value;
            var inputName = e.target.id;
            var id_attribute = e.target.name;
            var pic = e.target.getAttribute("picture");

            sectionsA.forEach((element) => {
              element.classList.remove("visited");
              element.parentNode.classList.remove("active");
              // optionsRadio.splice(
              //   optionsRadio.findIndex((item) => item.key == inputName),
              //   1
              // );

              //verificam daca nu avem deja selectat un atribut la fel
              if (optionsRadio.some((item) => item.key == id_attribute)) {
                //cautam valoarea atributului vechi pt a o scoate din suma totala

                optionsRadio.map((item) => {
                  if (item.key == id_attribute) {
                    sum -= Number(item.value) * Number(qty.value);

                    priceLabel.innerHTML = "COSTUL CONFIGURATIEI:";
                    price.innerHTML = "+" + "0.00 lei";
                  }
                });

                //scoatem atributul din array
                optionsRadio.splice(
                  optionsRadio.findIndex((item) => item.key == id_attribute),
                  1
                );
              }
            });

            var sectionsLi = document.querySelectorAll("li");

            sectionsLi.forEach((element) => {
              if (
                element
                  .querySelector("a")
                  .querySelector("input")
                  .getAttribute("id_input") == saved_input
              ) {
                element.classList.remove("active");
              }
            });

            var sect = e.target.parentNode.parentNode.querySelector("input");

            var images =
              e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
                .querySelector(".product_container__image")
                .querySelectorAll("img");

            var selected_img = "/images/" + pic;

            if (sect.getAttribute("id_input") == saved_input) {
              e.target.parentNode.classList.remove("visited");
              e.target.parentNode.parentNode.classList.remove("active");
              saved_input = 0;

              //verificam daca nu avem deja selectat un atribut la fel
              if (optionsRadio.some((item) => item.key == id_attribute)) {
                //cautam valoarea atributului vechi pt a o scoate din suma totala

                optionsRadio.map((item) => {
                  if (item.key == id_attribute) {
                    sum -= Number(item.value) * Number(qty.value);
                  }
                });

                //scoatem atributul din array
                optionsRadio.splice(
                  optionsRadio.findIndex((item) => item.key == id_attribute),
                  1
                );

                images.forEach((element) => {
                  if (element.name == id_attribute) {
                    if (element.src.includes(selected_img)) {
                      element.style.display = "none";
                    }
                  }
                });
              }

              console.log(optionsRadio);
            } else {
              e.target.parentNode.classList.add("visited");
              e.target.parentNode.parentNode.classList.add("active");

              saved_input = e.target.parentNode.parentNode
                .querySelector("input")
                .getAttribute("id_input");

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
              price.innerHTML =
                "+" + Number(inputValue) * Number(qty.value) + ".00 lei";
              console.log(optionsRadio);

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
          } else if (e.target.type === "checkbox") {
            if (e.target.parentNode.classList[0] === "visited") {
              e.target.parentNode.classList.remove("visited");
              e.target.parentNode.parentNode.classList.remove("active");
              var inputName = e.target.id;

              var id_attribute = e.target.name;
              var pic = e.target.getAttribute("picture");

              optionsCheckBox.splice(
                optionsCheckBox.findIndex((item) => item.key == inputName),
                1
              );

              console.log(optionsCheckBox);

              selectedItemLabel.innerHTML = "";
              optionsCheckBox.forEach((element) => {
                selectedItemLabel.innerHTML += element.key + ", ";
              });

              var inputValue = e.target.value;
              sum -= inputValue * Number(qty.value);

              priceLabel.innerHTML = "COSTUL CONFIGURATIEI:";
              price.innerHTML = "+" + "0.00 lei";

              var images =
                e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
                  .querySelector(".product_container__image")
                  .querySelectorAll("img");

              var selected_img = "/images/" + pic;

              images.forEach((element) => {
                if (element.name == id_attribute) {
                  if (element.src.includes(selected_img)) {
                    element.style.display = "none";
                  }
                }
              });
            } else {
              e.target.parentNode.classList.add("visited");
              e.target.parentNode.parentNode.classList.add("active");
              var inputValue = e.target.value;
              var inputName = e.target.id;

              var id_attribute = e.target.name;
              var pic = e.target.getAttribute("picture");

              optionsCheckBox.push({ key: inputName, value: inputValue });

              selectedItemLabel.innerHTML = "";
              optionsCheckBox.forEach((element) => {
                selectedItemLabel.innerHTML += element.key + ", ";
              });

              e.target.parentNode.parentNode.parentNode.parentNode
                .querySelector(".header")
                .appendChild(selectedItemLabel);

              sum += Number(inputValue) * Number(qty.value);
              priceLabel.innerHTML = "COSTUL CONFIGURATIEI:";
              price.innerHTML =
                "+" + Number(inputValue) * Number(qty.value) + ".00 lei";

              var images =
                e.target.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
                  .querySelector(".product_container__image")
                  .querySelectorAll("img");

              var selected_img = "/images/" + pic;

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

          document.getElementById("final_price").innerHTML = sum + ".00 lei";
        }
      });

    document
      .querySelector(".woopq-quantity-input")
      .addEventListener("click", (e) => {
        const qty = document.getElementById("quantity_6322c048d0003");

        if (e.target.matches(".woopq-quantity-input-minus")) {
          if (qty.value > 1) {
            sum = sum / Number(qty.value);
            qty.value--;
            sum = sum * Number(qty.value);
          }
        } else if (e.target.matches(".woopq-quantity-input-plus")) {
          sum = sum / Number(qty.value);
          qty.value++;
          sum = sum * Number(qty.value);
        }

        document.getElementById("final_price").innerHTML = sum + ".00 lei";
      });
  });
}

init();
