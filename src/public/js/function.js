function addToCart(_id) {
	var quantity = document.getElementById(`quantity-${_id}`).value;
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
	}).then((data) => {
		console.log(data.status);
		// so sánh data.status
		// 200 là thành công
		// 400 là lỗi từ client, ví dụ như thêm vào giỏ hàng quá số lượng tồn kho hoặc sản phẩm không tồn tại
		// 500 là lỗi không xác định từ server
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
	var listProduct = document.getElementsByClassName('product');
	var submitProduct = [];
	for (var product of listProduct) {
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
	}).then((log) => {
		if (log.status != 400) {
			window.location = '/cart/bill';
		} else {
			alert('lỗi');
		}
	});
}
if (window.history.replaceState) {
	window.history.replaceState(null, null, window.location.href);
}
