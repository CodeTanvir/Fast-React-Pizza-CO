import {Link} from "react-router-dom"
import SearchOder from "../features/order/SearchOder"
import Username from "../features/user/Username"

function Header() {
    return (
      <header className="flex items-center justify-between 
      bg-yellow-400 print:hidden
      uppercase px-4 py-3 border-stone-200 border-b sm:px-6 ">
      <Link to='/' className="tracking-widest">Fast React Pizza Co.</Link>
      <SearchOder />
      <Username />
      </header>
    )
}

export default Header
