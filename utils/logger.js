const logger = {
    info: (message, extra = {}) => {
        console.log(`[INFO] ${new Date().toISOString()} - ${message}`, extra);
    },
    error: (message, error = {}) => {
        console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error);
    },
    debug: (message, extra = {}) => {
        console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`, extra);
    },
    request: (req, res, next) => {
        logger.info(`${req.method} ${req.url}`, {
            headers: req.headers,
            body: req.body,
            query: req.query,
            params: req.params
        });
        next();
    }
};

module.exports = logger