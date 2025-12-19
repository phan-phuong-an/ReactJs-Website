const BASE = 'http://api.sanglocsom2.dientoan.vn';
let _token = localStorage.getItem('accessToken') || null;
let _defaultIncludeCredentials = false;

function buildUrl(path, params) {
    const url = path.startsWith('/') ? `${BASE}${path}` : `${BASE}/${path}`;  
    if (!params) return url;
    const qs = new URLSearchParams(params).toString();
    return qs ? `${url}?${qs}` : url;
}

function buildHeaders(hasJsonbody = true) {
    const headers = {}; 
    if (hasJsonbody) headers['Content-Type'] = 'application/json';
    
    const token = localStorage.getItem('accessToken');
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    return headers;
}

async function request(method, path, { params, body, includeCredentials } = {}) {
    const url = buildUrl(path,params);
    const opts = {
        method: method.toUpperCase(),
        headers: buildHeaders(!!body),
    };


    if (process.env.NODE_ENV === 'development') {
        try {
            const safeBody = body && typeof body === 'object' ? JSON.stringify(body) : body;
            console.debug('[apiFetch] Request:', { method: opts.method, url, headers: opts.headers, body: safeBody, includeCredentials });
        } catch (e) {
            console.debug('[apiFetch] Request build error', e);
        }
    }

    if (includeCredentials === true ) opts.credentials = 'include';
    else if (includeCredentials === false ) opts.credentials = 'same-origin';
    else if (_defaultIncludeCredentials) opts.credentials = 'include';

    if (body !== undefined) opts.body = JSON.stringify(body);

    const resp = await fetch(url, opts);

    const contentType = resp.headers.get('content-type') || '';
    let data = null;
    if (contentType.includes('application/json')) {
        data = await resp.json();
    } else {
        data = await resp.text();
    }

    if (!resp.ok) {
        if (resp.status === 304) {
            return { data: [], status: 200, headers: resp.headers };
        }
        
        if (resp.status === 401 || resp.status === 403) {
            _token = null;
            localStorage.removeItem('accessToken');

            alert('Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại.');
            window.location.href = '/login';
            return;
        }

        const err = new Error('Network response was not ok');
        err.status = resp.status;
        err.data = data;
        const ra = resp.headers.get('Retry-After') || resp.headers.get('retry-after');
        if (ra) err.retryAfter = ra;
        throw err;
    }
 

    return { data, status: resp.status, headers: resp.headers };
}

export const apiFetch = {
    setToken(token, { persist = true } = {}) {
        _token = token;
        if (persist) localStorage.setItem('accessToken', token);
    },

    clearToken() {
        _token = null;
        localStorage.removeItem('accessToken');
    },

    setDefaultIncludeCredentials(flag = false) {
        _defaultIncludeCredentials = !!flag;
    },

    async get(path, params, opts = {}) {
        return request('GET', path, { params, includeCredentials: opts.includeCredentials });
    },

    async post (path, body, opts = {}) {
        return request('POST', path, { body, includeCredentials: opts.includeCredentials });
    },

    async put (path, body, opts = {}) {
        return request('PUT', path, { body, includeCredentials: opts.includeCredentials });
    },

    async delete(path, params, opts = {}) {
        return request('DELETE', path, { params, includeCredentials: opts.includeCredentials });
    },
};

export const fetchClient = async (url, options = {}) => {
    const token = localStorage.getItem('accessToken');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, { ...options, headers });

    if(response.status === 401 || response.status === 403) {
        localStorage.removeItem('accessToken');
        return null;
    }

    return response;
};

export default apiFetch;  