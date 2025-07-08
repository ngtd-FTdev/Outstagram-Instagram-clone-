'use strict'

class ErrorResponse extends Error {
    constructor(statusCode, message) {
        super(message)

        this.name = 'ErrorResponse'

        // Gán thêm http status code
        this.statusCode = statusCode

        // Ghi lại Stack Trace (dấu vết ngăn xếp)
        Error.captureStackTrace(this, this.constructor)
    }
}

export default ErrorResponse
