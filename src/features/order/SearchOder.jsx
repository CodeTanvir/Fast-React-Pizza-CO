import { useState } from "react"
import { redirect, useNavigate,  } from "react-router-dom"

function SearchOder() {
    const [query, setQuery] = useState("")
    const navigate = useNavigate();

    function handleSubmit(e){
        e.preventDefault();
        if (!query) return;
         setQuery("");
        return navigate(`/order/${query}`);
    }
    return (
        <form onSubmit={handleSubmit}>
       <input placeholder="Search Order #"
        value={query} 
        onChange={(e)=> setQuery(e.target.value)}
        className="rounded-full 
        bg-yellow-100 px-4 py-2 sm:w-64 sm:focus:w-72 transition-all duration-300
        text-sm placeholder:text-stone-400 w-28
          focus:outline-none 
           focus:ring focus:ring-yellow-500 focus:ring-opacity-50"
        /></form>
    )
}

export default SearchOder
