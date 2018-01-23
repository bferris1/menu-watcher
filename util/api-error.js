class APIError extends Error {
	constructor (message, status) {
		super(message);

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, APIError);
		}

		this.status = status;
	}
}


module.exports = APIError;