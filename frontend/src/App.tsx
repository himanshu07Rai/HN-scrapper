import { useEffect, useState } from "react";
import "./App.css";
import api from "./utils/axiosClient";

function App() {
    const [stories, setStories] = useState([]);

    const getStories = async () => {
        try {
            const data = (await api.get("/stories")) as { data: { stories: [] } };
            const st = data.data.stories;
            console.log(st);
            setStories(st);
        } catch (e) {
            console.log(e);
        }
    };

    useEffect(() => {
        getStories();
    }, []);

    // const handleClick = () => {
    //     setCount((prev) => ({ ...prev, value: prev.value + 1 }));
    //     setCount((prev) => ({ ...prev, value: prev.value + 1 }));
    //     setCount((prev) => ({ ...prev, value: prev.value + 1 }));
    // };

    console.log(stories);

    return (
        <>
            <div>
                {stories.map((story: { _id: string; title: string }) => (
                    <div key={story._id}>{story.title}</div>
                ))}
            </div>
        </>
    );
}

export default App;
