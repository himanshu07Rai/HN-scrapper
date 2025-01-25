// Retry configuration
export const MAX_RETRIES = 1;
export const INITIAL_DELAY = 6000; // 6 seconds

export const HTTP_CODE = {
    OK: 200,
    PENDING: 201,
    ACCEPTED: 202,
    REDIRECT_PERMANENT: 301,
    REDIRECT_TEMP: 302,
    BAD_REQUEST: 400,
    NO_AUTH: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    SERVER_ERROR: 500,
    SERVICE_DOWN: 503
};

export const BIZ_ERROR = "BizError";
export const APP_ISE = "APPISE";
