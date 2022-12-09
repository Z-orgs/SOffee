function addToCart(_id) {
	_id = _id.trim();
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
	})
		.then((data) => {
			console.log(data);
			location.reload();
		})
		.catch((err) => {
			console.log(err);
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
			location.reload();
		});
}
function showForm(_id) {
	document.getElementById(_id).removeAttribute('hidden');
}
function deleteProduct(_id) {
	fetch(`/admin/product/delete/${_id}`, {
		method: 'delete',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	}).then((log) => {
		location.reload();
	});
}
function deleteMember(_id) {
	fetch(`/admin/member/delete/${_id}`, {
		method: 'delete',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	})
		.then((log) => log.json())
		.then((log) => {
			location.reload();
		});
}
function deleteGuest(_id) {
	fetch(`/admin/guest/delete/${_id}`, {
		method: 'delete',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	})
		.then((log) => log.json())
		.then((log) => {
			location.reload();
		});
}
function deleteAdmin(_id) {
	fetch(`/admin/admin/delete/${_id}`, {
		method: 'delete',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	})
		.then((log) => log.json())
		.then((log) => {
			location.reload();
		});
}
function deleteBill(_id) {
	fetch(`/admin/bill/delete/${_id}`, {
		method: 'delete',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	})
		.then((log) => log.json())
		.then((log) => {
			location.reload();
		});
}
function deleteMessage(_id) {
	fetch(`/admin/message/delete/${_id}`, {
		method: 'delete',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
		},
	})
		.then((log) => log.json())
		.then((log) => {
			location.reload();
		});
}
if (window.history.replaceState) {
	window.history.replaceState(null, null, window.location.href);
}
