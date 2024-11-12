/**
 * @copyright 2024 Omar Elbayoumi
 */

/**
 * Components
 */

import About from "./components/About"
import Contact from "./components/Contact"
import Header from "./components/Header"
import Hero from "./components/Hero"
import Review from "./components/Review"
import Skill from "./components/Skill"
import Work from "./components/Work"

const App = () => {
  return (
    <>
    <Header />
    <main>
      <Hero />
      <About />
      <Skill />
      <Work />
      <Review />
      <Contact />
    </main>
    </>
  )
}

export default App