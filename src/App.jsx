import { useState } from 'react'
import Intro from './components/Intro'
import Menu from './components/Menu'
import Learn from './components/Learn'
import Draw from './components/Draw'
import Quiz from './components/Quiz'

function App() {
  const [currentPage, setCurrentPage] = useState('intro')

  const renderPage = () => {
    switch (currentPage) {
      case 'intro':
        return <Intro setPage={setCurrentPage} />
      case 'menu':
        return <Menu setPage={setCurrentPage} />
      case 'learn':
        return <Learn setPage={setCurrentPage} />
      case 'draw':
        return <Draw setPage={setCurrentPage} />
      case 'quiz':
        return <Quiz setPage={setCurrentPage} />
      default:
        return <Intro setPage={setCurrentPage} />
    }
  }

  return (
    <>
      {renderPage()}
    </>
  )
}

export default App
