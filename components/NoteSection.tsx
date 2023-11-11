import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Tiptap from "./Tiptap";
import { IconLoader2 } from "@tabler/icons-react";
interface NoteSectionProps {
  note: string;
  setNote: React.Dispatch<React.SetStateAction<string>>;
}
export default function NoteSection({ note, setNote }: NoteSectionProps) {
  const [loading, setLoading] = useState(false);

  const handlePublishNote = async () => {
    // handle publish note
    const URL = "https://www.fin.guru/wp-json/wp/v2/posts";
    /*
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "**",
        },
        body: `username=${encodeURIComponent()}&password=${encodeURIComponent(password)}`,
    };
    */
    // Step 2: Define the base URL for the WordPress API
    const baseUrl = 'https://your-wordpress-site.com/wp-json';
    
    const title: string = (note.match(/<h1>(.*?)<\/h1>/g) || note.match(/<h2>(.*?)<\/h2>/g))?.[0] ?? "";

    // Step 3: Define the post data
    const postData = {
      date: new Date().toISOString(),
      slug: title?.replaceAll(" ", "-") ?? "",
      status: 'publish',
      title: title,
      content: {
        rendered: note,
        protected: false,
      },
      author: 564,
    };

    const url = `${baseUrl}/wp/v2/posts`;

    // Step 5: Use fetch to send a POST request to the full URL with the post data
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        
      },
      body: JSON.stringify(postData),
    });

    // Step 6: Parse the response as JSON
    const data = await response.json();

    // Step 7: Handle the JSON data in the response
    console.log(data);
  };

  return (
    <section className="flex flex-col gap-6 w-full justify-center align-middle">
      <Tiptap note={note} setNote={setNote} />
      <div className="flex justify-center">
        <Button
          className="text-xl px-12 py-6"
          onClick={handlePublishNote}
          disabled={!note || loading}
        >
          {loading ? (
            <div className="animate-spin">
              <IconLoader2 />
            </div>
          ) : (
            "Publicar Nota"
          )}
        </Button>
      </div>
    </section>
  );
}
