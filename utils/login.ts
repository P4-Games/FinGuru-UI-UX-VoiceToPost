
export const saveToken = (token: string) => {
    localStorage.setItem("token", token);
}

export const isLoggedIn = () => {
    const token = localStorage.getItem("token");
    return token !== null;
}

export const logout = () => {
    localStorage.removeItem("token");
}

export const getToken = () => {
    return localStorage.getItem("token");
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

export const getUserDetails = async (token: string): Promise<UserDetailsResponse> => {
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
    
    const options = {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    };

    const query = await fetch(URL, options);
    if(!query.ok) return res;

    const data = await query.json();

    return data ?? res;
}

