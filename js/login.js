
class LoginForm {
	constructor() {
		const ctx = this;

		this.form = document.querySelector('.form--login');
		this.messageBlock = document.querySelector('.form-message');

		const onSubmit = function (event) {
			event.preventDefault();

			const formData = new FormData(event.target);
			const sendData = Object.fromEntries(formData);

			const headers = {
				"Content-Type": "application/json",
				"Accept": "application/json",
			};

			try {
				fetch('/api/login', {
					method: "POST",
					headers,
					body: JSON.stringify(sendData),
				})
					.then(response => response.json())
					.then(responseData => {
						if ( responseData.error ) {
							ctx.setMessage('Accesses are not correct');
							return true;
						}
					})
			} catch (err) {
				ctx.setMessage(err.message);
			}

			return true;
		}
		this.form.addEventListener('submit', onSubmit);
	}

	setMessage(msgText) {
		this.resetMessage();
		if ( msgText ) {
			this.messageBlock.classList.add('form-message--show');
			this.messageBlock.innerText = msgText;
		}
	}

	resetMessage() {
		this.messageBlock.classList.remove('form-message--show');
		this.messageBlock.innerText = '';
	}
}

document.addEventListener('DOMContentLoaded', () => {
	new LoginForm();
});