import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Tiptap from "./Tiptap";
import { IconLoader2 } from "@tabler/icons-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { getUserID, getUsername } from "@/utils/login";
import { publishPost } from "@/utils/articles";
interface NoteSectionProps {
  note: string;
  setNote: React.Dispatch<React.SetStateAction<string>>;
}
export default function NoteSection({ note, setNote }: NoteSectionProps) {
  const [loading, setLoading] = useState<boolean>(false);
  const [categories, setCategories] = useState<[number, string][]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>(0);

  const getCategories = async () => {
    const URL = "https://www.fin.guru/custom-endpoints/categories";

    const response = await fetch(URL);

    if (response.ok) {
      const { categories } = await response.json();
      if(categories) {
        let newCategories = categories.map((category: {
          name: string;
          id: number;
        }) => {
          return [category.id, category.name];
        });

        setCategories(newCategories);
      }
    }
  };

  const getNoteTitle = (): string => {
    let res = "";
    //Note could be a string or an HTML string
    //Get the title from the first line of the note or from the text content of the first tag
    if (note) {
      const noteLines = note.split("</");
      if (noteLines.length == 0) {
        res = noteLines[0];
      } else {
        const noteTags = note.split("<"); 
        if (noteTags.length > 0) {
          res = noteTags[1].split(">")[1].split("</")[0];
        }
      }
    }

    return res;
  }

  const handlePublishNote = async () => {
    // handle publish note
    setLoading(true);
    console.log(getNoteTitle());
    console.log(note);
    console.log(selectedCategory);

    const uid = await getUserID(getUsername());
    console.log(uid)

    const url = await publishPost(getNoteTitle(), note.replace("<h1>" + getNoteTitle() + "</h1>", ""), uid, selectedCategory);

    setLoading(false);
    window.open(url, "_blank");
  };

  useEffect(() => {
    getCategories();
  }, [])

  return (
    <section className="flex flex-col gap-6 w-full justify-center align-middle">
      <Tiptap note={note} setNote={setNote} />
      <div className="flex flex-row justify-center items-center gap-6">
        Categoría:
        <Select onValueChange={(value) => setSelectedCategory(parseInt(value))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category[0]} value={category[0].toString()}>
                {category[1]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-center">
        <Button
          className="text-xl px-12 py-6"
          onClick={handlePublishNote}
          disabled={!note || loading}
        >
          {loading ? (
            <>
              Publicando
              <div className="animate-spin ml-2">
                <IconLoader2 />
              </div>
            </>
          ) : (
            "Publicar Nota"
          )}
        </Button>
      </div>
    </section>
  );
}
