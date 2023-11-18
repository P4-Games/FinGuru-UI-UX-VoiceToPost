import { Article } from "@/components/Article";
import { getUserID, getUsername } from "./login";

export const getUserArticles = async (name: string): Promise<Article[]> => {
    let res: Article[] = [];

    const URL = "https://www.fin.guru";
    const ALLPOSTS_ENDPOINT = "/custom-endpoints/posts-by-author?author_id="
    const VIEWS_ENDPOINT = "/wp-json/post-views-counter/get-post-views/" //:<post_id>

    const uid = await getUserID(name);

    const posts = await fetch(URL + ALLPOSTS_ENDPOINT + uid)
        .then(res => res.json())
        .catch(err => console.log(err));

    if(posts) {
        const allPosts = posts?.posts;

        for(const element of allPosts) {
            const views = await fetch(URL + VIEWS_ENDPOINT + element.id)
                .then(res => res.json())
                .catch(err => console.log(err));

            res.push({
                title: element.title,
                link: "https://www.fin.guru/?p=" + element.id,
                visits: views,
            });
        }
        console.log(res)

    }
    return res;
}

export const publishPost = async (title: string, content: string, author_id: number, categories: number): Promise<string> => {
    //Input: Form data: "title", "content", "author_id", "categories" all as string
    //Output: Post id as int
    //Return: URL: "https://www.fin.guru/?p=" + post_id

    let res = "https://www.fin.guru/";
    const URL = "https://www.fin.guru/custom-endpoints/publish-post";
    
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "*/*",
        },
        body: `title=${encodeURIComponent(title)}&content=${encodeURIComponent(content)}&author_id=${encodeURIComponent(author_id)}&categories=${encodeURIComponent(categories)}`,
    };

    const query = await fetch(URL, options)
        .then(res => res.json())
        .catch(err => console.log(err));

    if (query) {
        res += "?p=" + query.post_id;
    }

    return res;
}