
export const saveToken = (token: string, username: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
}

export const isLoggedIn = () => {
    const token = localStorage.getItem("token");
    return token !== null;
}

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
}

export const getToken = () => {
    return localStorage.getItem("token");
}

export const getUsername = (): string => {
    return localStorage.getItem("username") ?? "";
}

export const getUserID = async (username: string): Promise<number> => {
    const URL = "https://www.fin.guru/custom-endpoints/authors-by-name?name=";

    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "*/*",
        },
    };

    const query = fetch(URL + username, options);

    const data = await (await query).json();

    return data?.author_id ?? 0;
}

type LoginResponse = {
    token_type: string,
    iat: number,
    expires_in: number,
    jwt_token: string,
}

export const login = async (user: string, password: string, setMessage?: (message: string) => void, setIsLoading?: (value: boolean) => void): Promise<LoginResponse> => {
    let res = {
        token_type: '',
        iat: 0,
        expires_in: 0,
        jwt_token: '',
    }

    setIsLoading?.(true)
    setMessage?.('')
    
    const URL = "https://fin.guru/index.php?rest_route=/api/v1/token";

    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "*/*",
        },
        body: `username=${encodeURIComponent(user)}&password=${encodeURIComponent(password)}`,
    };

    const query = await fetch(URL, options);
    if(!query.ok) setIsLoading?.(false); 
    
    const data = await query.json();
    if(data?.status === 'error') {
        setMessage?.(data?.error_description);
    }
    
    setIsLoading?.(false)
    
    return data ?? res;
}

type UserDetailsResponse = {
    id: number,
    name: string,
    url: string,
    description: string,
    link: string,
    slug: string,
    avatar_urls: {
        24: string,
        48: string,
        96: string,
    },
    meta: any[],
    _links: {
        self: {
            href: string,
        }[],
        collection: {
            href: string,
        }[],
    },
}

export const getUsernameFromToken = async (token: string): Promise<UserDetailsResponse> => {
    let res: UserDetailsResponse = {
        id: 0,
        name: '',
        url: '',
        description: '',
        link: '',
        slug: '',
        avatar_urls: {
            24: '',
            48: '',
            96: '',
        },
        meta: [],
        _links: {
            self: [{
                href: '',
            }],
            collection: [{
                href: '',
            }],
        },
    }

    const URL = "https://fin.guru?rest_route=/wp/v2/users/me";

    const options: RequestInit = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Accept": "*/*",
            "Authorization": `Bearer ${token}`,
            "Origin": "http://localhost:3000",
        },
        mode: "cors",
    };

    const query = await fetch(URL, options);
    if(!query.ok) return res;

    const data = await query.json();

    return data ?? res;
}

