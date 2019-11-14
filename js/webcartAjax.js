var kPackageSelectId = 'TRI12E';
var quantityList = [1,2,3,4,5,6,12];
var currency = {
  code: '',
  symbol: '',
  prices: {}
}

function updateQty(selectId, updateURL) {
	var select = document.getElementById(selectId);
	if (!select) {
		select = {value:""};
	}
	var nocache = new Date();
	$.ajax({
		url:updateURL+select.value+"&nocache="+nocache.getTime(),
		context:document.body
	}).done(function(data, textStatus, jqXHR) {
		var block = document.getElementById('cartTableBlock');
		if (block) {
			block.innerHTML = data;
			updateQuantity();
		}
	}).fail(function( jqXHR, textStatus, errorThrown ) {
		location.reload(); // reload page if ajax fails
	});
}

function updateQuantity() {
	$('#packagePicker > ul.packageList > li').removeClass('checked');
	var packageSelect = document.getElementById(kPackageSelectId);
	if (packageSelect) {
		var value = packageSelect.value;
		var packagePicker = document.getElementById("packagePicker");
		packagePicker.className = "m"+value;
		$('#packagePicker > ul.packageList > li.m'+value).addClass('checked');
	} else {
		var packagePicker = document.getElementById("packagePicker");
		packagePicker.className = "";
	}
	$("select.qtychg").each(function(){
		$(this).after('<span class="qtyLabel">' + this.value + '</span>');
	});
	$("td.remove a").each(function(){
		var href = this.href;
		$(this).on("click", function() {
			updateQty(null, href);
			return false;
		});
		this.href = "order.html";
	});
	
}

function setupPackages() {
	$('#packagePicker > ul.packageList > li').each(function(){
		var value = parseInt(this.className.replace(/.*m([0-9]+).*/, "$1"));
		if(value > 0) {
			$(this).on('click', function(){
				updateItem(kPackageSelectId, value);
			});
		}
	});
}

function updateItem(itemId, qty) {
	var itemSelect = document.getElementById(itemId);
	if (itemSelect) {
		updateQty(null, "cart.php?action=updateQty&cr="+itemId+"&qty="+qty);
	} else {
		addItem(itemId, qty);
	}
}

function addItem(itemId, qty) {
	updateQty(null, "cart.php?action=addToCart&cr="+itemId+"&qty="+qty);
}

function removeItem(itemId) {
	updateQty(null, "cart.php?action=removeFromCart&cr="+itemId);
}

function updateCurrency (cur,target) {
	$.ajax({
		url:target+cur,
		context:document.body
	}).done(function(data, textStatus, jqXHR) {
		var block = document.getElementById('cartTableBlock');
		if (block) {
			block.innerHTML = data;
			updateCurrencyValues(function() { updateQuantity(); });
		}
	}).fail(function( jqXHR, textStatus, errorThrown ) {
		location.reload(); // reload page if ajax fails
	});
}

function updateCurrencyValues(callback) {
  var nocache = new Date();
  $.get('cart.php?action=getCurrencyValues&nocache='+nocache.getTime(), function(data) {
    bits = data.split('|');
    currency['code'] = bits[0];
    currency['symbol'] = bits[1];
    qtyURL = '&qty='+quantityList.join('|');
    $.getJSON('cart.php?action=getPriceList&cr='+kPackageSelectId+qtyURL+'&nocache='+nocache.getTime(), function(data) {
      $.each(quantityList,function(i,v) {
        currency['prices'][v] = data[v];
        var diff = ((currency['prices'][1]*v)-currency['prices'][v]).toFixed(0);
        var price = (currency['prices'][v]).toFixed(2);
        var pricePerMonth = (currency['prices'][v]/v).toFixed(0);
        $('li.m'+v+' div.label .savings .amount').html(currency['symbol']+diff);
        $('li.m'+v+' div.label .priceTotal').html(currency['symbol']+price+'!');
        $('li.m'+v+' div.label .pricePerMonth').html(currency['symbol']+pricePerMonth+' Per Month');
        $('ul.packageList').each(function() {
        	this.className = 'packageList '+currency['code'];
        });
      });
      if (callback) {
        callback();
      }
    });
  });
}

$(window).load(function(){
	setupPackages();
	updateCurrencyValues(function() { updateQuantity(); });
});
