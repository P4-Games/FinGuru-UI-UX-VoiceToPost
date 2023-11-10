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