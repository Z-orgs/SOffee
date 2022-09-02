function addToCart(_id) {
	const quantity = document.getElementById(`quantity-${_id}`).value;
	fetch('/addToCart', {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify({
			productId: _id,
			quantity: quantity,
		}),
	})
		.then((log) => log.json())
		.then((data) => {
			console.log(data.msg);
		});
}
function guest() {
	fetch('/', {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify({
			typeOfForm: 'guest',
		}),
	}).then((data) => {
		console.log(data);
		location.reload();
	});
}
function submitBill() {
	const listProduct = document.getElementsByClassName('product');
	let submitProduct = [];
	for (const product of listProduct) {
		if (product.getElementsByTagName('input')[0].checked === true) {
			submitProduct.push({
				productId: product.getElementsByTagName('input')[1].value,
				quantity: product.getElementsByTagName('input')[2].value,
			});
		}
	}
	fetch('/cart', {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify({
			submitProduct: submitProduct,
		}),
	})
		.then((log) => log.json())
		.then((log) => {
			if (log.status != 400) {
				window.location = '/cart/bill';
			} else {
				console.log(log.msg);
			}
		});
}
function changePassword() {
	fetch('/changePassword', {
		method: 'post',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
		body: JSON.stringify({
			oldPw: document.getElementsByName('oldPw')[0].value,
			newPw: document.getElementsByName('newPw')[0].value,
			rePw: document.getElementsByName('rePw')[0].value,
		}),
	})
		.then((log) => log.json())
		.then((log) => {
			console.log(log.msg);
		});
}
if (window.history.replaceState) {
	window.history.replaceState(null, null, window.location.href);
}
