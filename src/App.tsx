import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import Home from './pages/Home'
import Compare from './pages/Compare'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'

function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/compare', element: <Compare /> },
    ],
  },
])

function App() {
  return <RouterProvider router={router} />
}

export default App
