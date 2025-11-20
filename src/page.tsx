import "./page.css"
import { Virtualizer } from "./virtualizer"

const Page = () => {
  return (
    <div className="container">
      <h1>List</h1>
      <Virtualizer />
    </div>
  )
}

export { Page }
