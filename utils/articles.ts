import { Article } from "@/components/Article";
import { getUsername } from "./login";

export const getUserArticles = async (name: string): Promise<Article[]> => {
    let res: Article[] = [];

    const URL = "https://www.fin.guru/wp-json"
    const POSTS_ENDPOINT = "/wp/v2/posts?per_page=50"
    const VIEWS_ENDPOINT = "/post-views-counter/get-post-views/" //:<post_id>

    const posts = await fetch(URL + POSTS_ENDPOINT)
        .then(res => res.json())
        .catch(err => console.log(err));
    
    if (posts) {
        for (const post of posts) {
            if (post?.yoast_head_json?.author == getUsername()){
                const views = await fetch(URL + VIEWS_ENDPOINT + post.id)
                    .then(res => res.json())
                    .catch(err => console.log(err));
                
                res.push({
                    title: post.title.rendered,
                    visits: views ?? "",
                    link: post.link
                });
            }

        }
    }
    console.log(res);
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