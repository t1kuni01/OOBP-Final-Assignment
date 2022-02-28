var productsContainer,
    productsList,
	shoppingCartContainer,
    shoppingCartTotal,
    cartButton,
    cartButtonQty,
    currentCat,
    clearButton,
    checkoutButton,
	popupContainer,
	popupInterface,
    couponCodeField;

var timer;


var Product = function(itemName, brand, cat, price, desc, imgPath, maxQtyPerOrder) {
    this.itemName = itemName;
    this.brand = brand;
	this.price = price.toFixed(2);
    this.desc = desc;
    if (imgPath) {
        this.imgPath = imgPath;
    } else {
        this.imgPath = "img/noPreview.jpg";
    }
this.maxQtyPerOrder = maxQtyPerOrder;
this.id = Shop.getCategory(cat).toString() + cat.length.toString();
}

var Shop = {
    products: { 
        fashion: new Array(),
    },
    displayProducts: function(list) {
        var cat = this.getCategory(currentCat) == undefined? "search results":this.getCategory(currentCat); 
        productsContainer.innerHTML = 
            "<h1>" + cat.toUpperCase() + "</h1>" +
            "</span><br/>";
        for (var k = 0; k < list.length; k++) { 
            var p = list[k];
            productsContainer.innerHTML +=
                "<div onclick='PopupInterface.drawProductInfo(&quot;" + p.id + "&quot;)'>" +
                    "<div class='square'>" +
                        "<div id='img' style='background-image: url(" + p.imgPath + ")'></div>" +
                    "</div>" +
                    "<h5><br/>" + p.cat + "<h5/>" +
                    "<h3>" + p.itemName + "</h3>" +
                    "<h4>" + p.brand + "</h4>" +
                    "<h2>$" + p.price + "</h2><br/>" +
                    "<button onclick='preventParentEvent(event); ShoppingCart.add(&quot;" + p.id + "&quot;, true);'>ADD TO CART</button>" +
                "</div>"; 
        }
    },
    getCategory: function(ref) {
        for (var c in this.products) {
            if (ref == this.products[c]) {
                return c;
            }
        }
    },
    getProductById: function(id) { 
        for (var c in this.products) { 
            for (var p = 0; p < this.products[c].length; p++) {
                if (this.products[c][p].id == id) { 
                    return this.products[c][p]; 
                }
            }
        }
    },
    displayCatList: function() { 
        productsList.innerHTML = "";
        for (var c in this.products) {
            if (this.products[c] == currentCat) { 
                productsList.innerHTML += "<button class='p-selected' onclick='Shop.changeCat(Shop.products." + c + ")'>" + (c.toString().toUpperCase()) + "</button>"; 
            } else {
                productsList.innerHTML += "<button onclick='Shop.changeCat(Shop.products." + c + ")'>" + (c.toString().toUpperCase()) + "</button>";
            }
        }
    },
   
    searchProducts: function(searchTerm) { 
        var term = searchTerm.toLowerCase(); 
        currentCat = null;
        this.displayCatList();
        var searchResults = new Array(); 
        for (var c in this.products) { 
            for (var p = 0; p < this.products[c].length; p++) { 
                var added = false; 
                var name = this.products[c][p].itemName.toLowerCase(); 
                var cat = this.products[c][p].cat.toLowerCase(); 
                if (term.length <= name.length) { 
                    for (var i = 0; i < name.length - term.length + 1; i++) { 
                        if (name.substr(i, term.length) == term) { 
                            searchResults.push(this.products[c][p]);
                            added = true;
                            break; 
                        }
                    }
                }
                if (!added && term.length <= cat.length) { 
                    for (var i = 0; i < cat.length - term.length + 1; i++) {
                        if (cat.substr(i, term.length) == term) {
                            searchResults.push(this.products[c][p]);
                            break;
                        }
                    }
                }
            };
        }
        this.displayProducts(searchResults); 
    },
    setCanCheckout: function(canCheckout) { 
        if (canCheckout) {
            checkoutButton.setAttribute("onclick", "PopupInterface.drawCheckout();");
        } else {
            checkoutButton.setAttribute("onclick", "alert('You must login to continue.');");
        }
    }
};


var ShoppingCart = { 
    list: new Array(), 
    shoppingCartShowTime: 1500, 
	itemToHighlight: null,
    add: function(id, maximize) { 
        var added = false;
		var exceededQtyItem = null;
        var product = Shop.getProductById(id); 
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i][0].id == id) { 
                this.itemToHighlight = this.list[i];
				if (this.list[i].length < this.list[i][0].maxQtyPerOrder) { 
					this.list[i].push(product);
					added = true;
					break;
				} else {
					exceededQtyItem = this.list[i][0];
				}
            }
        }
        if (!added) {
			if (exceededQtyItem) {
				alert( 
					"Only a maximum quantity of " + exceededQtyItem.maxQtyPerOrder + " is allowed for the following item:\n" +
					exceededQtyItem.itemName
				);
			} else {
                this.list.push([product]);
                this.itemToHighlight = this.list[this.list.length - 1];
            }
		}
        this.save(); 
        this.displayList(maximize);
        return;
    },
    clear: function() { 
        if (this.getNumOfItems() > 0) {
            if (confirm("Are you sure you want to clear the cart?")) {
                this.list = new Array();
                this.displayList(true);
                this.save();
            }
        }
    },
    displayList: function(maximize) { 
        if (this.getNumOfItems() == 0) {
            shoppingCartTotal.innerHTML = ""; 
            shoppingCartContainer.innerHTML = "<p style='padding-left: 20px;'>No items in cart.</p>";
        } else {
            shoppingCartTotal.innerHTML = "Total cost:<h2>$" + this.getTotalPrice() + "</h2>";
            shoppingCartTotal.innerHTML += this.getNumOfItems() + " item" + (this.getNumOfItems() == 1? "":"s") + " in cart.";
            shoppingCartContainer.innerHTML = "";
            for (var i = 0; i < this.list.length; i++) {
                var hl = this.itemToHighlight == this.list[i]? ' class="highlight" id="highlight"':"";
                shoppingCartContainer.innerHTML +=
                    "<div onclick='PopupInterface.drawProductInfo(&quot;" + this.list[i][0].id + "&quot;);'" + hl + ">" +
                    "<div class='mini-button' onclick='preventParentEvent(event); ShoppingCart.incrementQty(" + i + ", false, true)'> - </div>" +
                    "<div class='mini-button' onclick='preventParentEvent(event); ShoppingCart.incrementQty(" + i + ", true, true)'> + </div>" +
                    "&nbsp;<strong>" + this.list[i].length + "x</strong>&nbsp;&nbsp;" +
                    this.list[i][0].itemName +
                    "<span>$" + (this.list[i][0].price * this.list[i].length).toFixed(2) +
                    "</span></div>";
            }
        }
        if (!this.list.length) {
            checkoutButton.style.display = "none";
            clearButton.style.display = "none";
        } else {
            checkoutButton.style.display = "block";
            clearButton.style.display = "block";
        }
        if (this.itemToHighlight != null) {
            var hlElement = document.getElementById("highlight");
            if (hlElement) {
                if (hlElement.offsetTop > shoppingCartContainer.scrollTop) {
                    if (hlElement.offsetTop + hlElement.clientHeight > shoppingCartContainer.clientHeight + shoppingCartContainer.scrollTop) {
                        shoppingCartContainer.scrollTop = hlElement.offsetTop;
                    }
                } else {
                    shoppingCartContainer.scrollTop = hlElement.offsetTop - hlElement.clientHeight;
                }
            }
        }
		if (maximize) {
			if (!cartButton.hasClass("hover")) {
				cartButton.addClass("hover");
			} else {
				window.clearTimeout(timer);
			}
			timer = window.setTimeout(function() {
				cartButton.removeClass("hover");
			}, this.shoppingCartShowTime);
		}
        cartButtonQty.innerHTML = "(" + this.getNumOfItems() + ")";
    },
    incrementQty: function(i, increment, maximize) {
        this.itemToHighlight = this.list[i];
        if (!increment) {
            if (this.list[i].length > 1) {
                this.list[i].pop();
            } else {
				if (confirm("Do you want to remove " + this.list[i][0].itemName + " from the cart?")) {
                	this.list.splice(i, 1);
				} else {
					this.displayList(maximize);
					return;
				}
            }
            this.save();
        } else {
            this.add(this.list[i][0].id);
        }
        this.displayList(maximize);
    },
    getNumOfItems: function() {
        var num = 0;
        for (var i = 0; i < this.list.length; i++) {
            num += this.list[i].length;
        }
        return num;
    },
    getTotalPrice: function() {
        var totalPrice = 0;
        for (var i = 0; i < this.list.length; i++) {
            totalPrice += this.list[i][0].price * this.list[i].length;
        }
        return totalPrice.toFixed(2);
    },
    save: function() { 
        var tempCart = new Array();
        for (var i = 0; i < this.list.length; i++) {
            tempCart.push([this.list[i][0].id, this.list[i].length]);
		}
        Storage.setItem("shoppingCart", JSON.stringify(tempCart));
    },
    load: function() { 
        var tempCart = JSON.parse(Storage.getItem("shoppingCart"));
		if (tempCart) {
    		for (var t = 0; t < tempCart.length; t++) {
    			for (var i = 0; i < tempCart[t][1]; i++) { 
    				this.add(tempCart[t][0], false); 
    			}
    		}
        }
    }
};
var PopupInterface = {
	open: false,
	drawCheckout: function() {
        var randCoupon = CouponManager.getRandomCoupon();
        var randCouponDiscount = (randCoupon.discount * 100).toString() + "%";
		var checkoutCartItems = "";
		for (var i = 0; i < ShoppingCart.list.length; i++) {
			var p = ShoppingCart.list[i][0];
			checkoutCartItems +=
				"<div>" +
				"&nbsp;<strong>" + ShoppingCart.list[i].length + "x</strong>&nbsp;&nbsp;" +
				p.itemName +
				"<span>$" + (p.price * ShoppingCart.list[i].length).toFixed(2) +
				"</span></div>";
		}
		popupInterface.innerHTML =
			"<aside>" +
				"<h1>Checkout</h1>" +
				"<div class='shopping-cart-container'>" +
					checkoutCartItems +
				"</div><br/>" +
				"<div class='shopping-cart-total'>" +
					"Total cost:<h2 id='total-checkout-cost'>$" + ShoppingCart.getTotalPrice() + "</h2>" +
					ShoppingCart.getNumOfItems() + " item" + (ShoppingCart.getNumOfItems() == 1? "":"s") + " in cart." +
				"</div><br/><hr/><br/>" +
				"<h1>Discount offer</h1>" +
				"<span>Enter code: [<strong>" + randCoupon.code + "</strong>] to get a " + randCouponDiscount + " discount on this purchase.</span><br/><br/>" +
				"Coupon code&nbsp;&nbsp;&nbsp;<input id='coupon-code-field' type='text'/>" +
			"</aside>" +
			"<aside>" +
				"<h1>Payment</h1>" +
                "<form name='checkoutForm' id='checkout-form'>" +
					"<br/><table width='100%'>" +
						"<tr>" +
							"<td align='right'>Name on card</td>" +
							"<td align='left'><input name='nameOnCard' placeholder='John Smith' type='text'/></td>" +
						"</tr>" +
						"<tr>" +
							"<td align='right'>Card number</td>" +
							"<td align='left'><input name='cardNumber' placeholder='1234123412341234' type='number'/></td>" +
						"</tr>" +
						"<tr>" +
							"<td align='right'>Expiry date</td>" +
							"<td align='left'><input name='expiryDate' type='date'/></td>" +
						"</tr>" +
						"<tr>" +
							"<td align='right'>CVV</td>" +
							"<td align='left'><input name='cvv' placeholder='123' type='number'/></td>" +
						"</tr>" +
					"</table><br/>" +
					
                "</form>" +
                "<span id='checkout-error-text'></span>" +
                "<button onclick='submitCheckoutForm()'>CONFIRM</button>" +
			"</aside>";
        initCheckout();
        var total = ShoppingCart.getTotalPrice();
        var discountedTotal;
        document.getElementById("coupon-code-field").oninput = function() {
            CouponManager.hasCoupon(this.value, function(coupon) {
                discountedTotal = (total - (total * coupon.discount)).toFixed(2);
                document.getElementById("total-checkout-cost").innerHTML =
                    "$" + total + " <span style='color: red;'>- " + (coupon.discount * 100).toString() + "%</span> = <span style='color: blue;'>$" + discountedTotal + "</span>";
            });
        };
		this.show(true);
	},
	drawProductInfo: function(id) {
        var p = Shop.getProductById(id);
        popupInterface.innerHTML =
            "<div id='img' style='background-image: url(" + p.imgPath + ")'></div>" +
            "<aside>" +
                "<h1>" + p.itemName + "</h1>" +
                "<h4>by " + p.brand + "</h4><br/>" +
                "<h1>$" + p.price + "</h1><br/>" +
                "<h3>Product Description</h3>" +
                "<span>" + p.desc + "</span><br/><br/><br/>" +
                "<span>Shipping: Free standard postage<br/>" +
                "Condition: Brand new<br/>" + "<br/>" + "<br/>" + "<br/>" + 
                "<button onclick='ShoppingCart.add(&quot;" + p.id + "&quot;, true);'>ADD TO CART</button>" +
            "</aside>" + 
            "</div>";
        this.show();
	},
	show: function(aboveAll) {
        if (aboveAll) {
            if (!popupContainer.hasClass("above-all")) {
                popupContainer.addClass("above-all");
            }
        } else {
            if (popupContainer.hasClass("above-all")) {
                popupContainer.removeClass("above-all");
            }
        }
        document.body.style.overflowY = "hidden";
        popupContainer.removeClass("hide");
        popupContainer.addClass("show");
		this.open = true;
	},
	hide: function() {
        document.body.style.overflowY = "scroll";
		popupContainer.addClass("hide");
        popupContainer.removeClass("show");
		this.open = false;
	}
};

var CouponManager = { 
    coupons: new Array(),
    getRandomCoupon: function() {
        return this.coupons[Math.round(Math.random() * (this.coupons.length - 1))];
    },
    createCoupon: function(couponCode, discountPercentage) {
        this.coupons.push({
            code: couponCode,
            discount: discountPercentage
        });
    },
    hasCoupon: function(couponCode, func) {
        for (var i = 0; i < this.coupons.length; i++) {
            if (couponCode == this.coupons[i].code) {
                if (func) {
                    func(this.coupons[i]);
                }
            }
        }
        return false;
    },
    getDiscount: function(couponCode) {
        for (var i = 0; i < this.coupons.length; i++) {
            if (couponCode == this.coupons[i].code) {
                return this.coupons[i].discount;
            }
        }
        return false;
    }
};

function initShop() { 
    getShopElementIds();
	addProducts();
    createCoupons();
    Shop.displayProducts(currentCat);
	Shop.displayCatList();
    Shop.setCanCheckout(false);
    ShoppingCart.load();
    ShoppingCart.displayList();
}

function getShopElementIds() { 
    currentCat = Shop.products.fashion;
    productsContainer = document.getElementById("products-container");
    shoppingCartContainer = document.getElementById("shopping-cart-container");
	productsList = document.getElementById("products-list");
    shoppingCartTotal = document.getElementById("shopping-cart-total");
    cartButton = document.getElementById("cart-button");
    cartButtonQty = document.getElementById("cart-button-qty");
    clearButton = document.getElementById("clear-button");
    checkoutButton = document.getElementById("checkout-button");
	popupContainer = document.getElementById("popup-container");
	popupInterface = document.getElementById("popup-interface");
}

function createCoupons() { 
    CouponManager.createCoupon("TwinjiT3CH18", 0.2);
    CouponManager.createCoupon("MASTERMAN01", 0.75);
    CouponManager.createCoupon("EUROPA_2049", 0.15);
	CouponManager.createCoupon("AZA1498", 0.40);
    CouponManager.createCoupon("MARS_MISSION99", 0.25); 
}

function addProducts() { 
    Shop.products.fashion.push(new Product(
        "T-shirt dress",
        "Art. No. 0967707006",
        Shop.products.fashion,
        39.00,
        "Short T-shirt dress in soft jersey with a round neckline, dropped shoulders and short sleeves. Gathered seam at the hips and a flared skirt.",
        "img/fashion/Product_1_2.jfif",
        100
    ));

   Shop.products.fashion.push(new Product(
        "Balloon-sleeved dress",
        "Art. No. 1032434002",
        Shop.products.fashion,
        40.00,
        "Short, A-line dress in a cotton weave. V-shaped opening at the front with a button at the top, long, raglan, balloon sleeves.",
        "img/fashion/Product_2_2.jfif",
        100
    ));

    Shop.products.fashion.push(new Product(
        "Drawstring dress",
        "Art. No. 1041648004",
        Shop.products.fashion,
        39.00,
        "Calf-length dress in a softly draping weave with a sheen and all-over print. Small collar with narrow ties and a V-neck opening at the top. ",
        "img/fashion/Product_3_3.jfif",
        100
    ));

    Shop.products.fashion.push(new Product(
        "Short shirt dress",
        "Art. No. 1049382001",
        Shop.products.fashion,
        40.99,
        "•	Short dress in poplin with notch lapels, a V-neck, a discreet zip and shaping seams at the front. Long sleeves and wide cuffs with a slit. ",
        "img/fashion/Product_4_3.jfif",
        100
    ));

    Shop.products.fashion.push(new Product(
        "Knee-length down jacket",
        "Art. No. 0972324001",
		Shop.products.fashion,
        35.50,
        "Knee-length jacket in nylon with a filling of 80% down and 20% feathers. ",
        "img/fashion/Product_5_2.jfif",
		100
    ));

    Shop.products.fashion.push(new Product(
        "Padded hooded outdoor jacket",
        "Art. No. 0976185001",
		Shop.products.fashion,
        40.50,
        "Fitted outdoor jacket in woven fabric with a double-layered hood, stand-up collar and zip down the front with an anti-chafe chin guard",
        "img/fashion/Product_6_2.jfif",
		100
    ));
    Shop.products.fashion.push(new Product(
        "Padded gilet",
        "Art. No. 0992638002",
        Shop.products.fashion,
        40.00,
        "Be awesome with this sick shirt, awe yeah!",
        "img/fashion/Product_7_2.jfif",
        100
    ));

    Shop.products.fashion.push(new Product(
        "Earth T-shirt",
        "Art. No. 0992638002",
        Shop.products.fashion,
        39.00,
        "B•	Quilted, padded gilet in woven fabric with a stand-up collar, zip down the front, side pockets and a drawstring at the waist",
        "img/fashion/Product_8_3.jfif",
        100
    ));

    Shop.products.fashion.push(new Product(
        "Wool-blend jacket",
        "Art. No. 1023659004",
        Shop.products.fashion,
        45.00,
        "Jacket in a soft, woven wool blend with a collar and peak lapels. ",
        "img/fashion/Product_9_2.jfif",
        100
    ));
    Shop.products.fashion.push(new Product(
        "Slim High Ankle Jeans",
        "Art. No. 0941374009",
        Shop.products.fashion,
        30.00,
        "5-pocket, ankle-length jeans in washed, stretch denim with a high waist, zip fly and button, and slim legs with raw-edge hems.",
        "img/fashion/Product_10_2.jfif",
        100
    ));

    Shop.products.fashion.push(new Product(
        "True To You Skinny High Jeans",
        "Art. No. 0986211008",
        Shop.products.fashion,
        60.00,
        "5-pocket jeans in super-flexible denim made from a cotton blend with an innovative stretch function ",
        "img/fashion/Product_11_2.jfif",
        100
    ));

    Shop.products.fashion.push(new Product(
        "Embrace High Ankle Jeans",
        "Art. No. 0882900030",
        Shop.products.fashion,
        50.00,
        "5-pocket, ankle-length jeans in washed, stretch denim with a high waist, zip fly and button and super-skinny legs. ",
        "img/fashion/Product_12_2.jfif",
        100
    ));


   
}
