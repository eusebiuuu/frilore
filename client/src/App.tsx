import React, { Suspense } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import FixedSidebar from "./components/FixedSidebar"
import Footer from "./components/Footer"
import Projects from "./features/projects/Projects"
const SingleProject = React.lazy(() => import("./features/projects/SingleProject"));
import MobileSidebar from "./components/MobileSidebar"
import AssignedTasks from "./features/tasks/AssignedTasks"
const PersonalProfile = React.lazy(() => import("./features/profile/PersonalProfile"));
const ForeignProfile = React.lazy(() => import("./features/profile/ForeignProfile"));
import Register from "./features/authentication/Register"
import Login from "./features/authentication/Login"
const Home = React.lazy(() => import("./features/home/Home"));
const CreateProject = React.lazy(() => import("./features/projects/CreateProject"));
import Dashboard from "./features/dashboard/Dashboard"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import Groups from "./features/chat/Groups"
import { useUserContext } from "./context/user"
import Loader from "./components/Loader"
import ProtectedRoute from "./components/ProtectedRoute"
import NotFound from "./features/extra/NotFound"

function App() {
  const { user } = useUserContext();
  return (<div>
    {
      user === null
      ? <Loader size='big' />
      : <>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Router>
          <Navbar />
          <div className="flex max-w-full">
            { user && <FixedSidebar /> }
            { user && <MobileSidebar /> }
            <Routes>
              <Route index element={
                user
                ? <Dashboard />
                : <Suspense fallback={<Loader size='big' />}>
                  <Home />
                </Suspense>
              } />
              <Route path='login' element={<Login />} />
              <Route path='register' element={<Register />} />
              <Route path='projects' element={
                <ProtectedRoute>
                  <Projects />
                </ProtectedRoute>
              } />
              <Route path='projects/:id' element={
                <ProtectedRoute>
                  <Suspense fallback={<Loader size='big' />}>
                    <SingleProject />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path='tasks' element={
                <ProtectedRoute>
                  <AssignedTasks />
                </ProtectedRoute>
              } />
              <Route path='profile' element={
                <ProtectedRoute>
                  <Suspense fallback={<Loader size='big' />}>
                    <PersonalProfile />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path='profile/:id' element={
                <Suspense fallback={<Loader size='big' />}>
                  <ForeignProfile />
                </Suspense>
              } />
              <Route path='create-project' element={
                <ProtectedRoute>
                  <Suspense fallback={<Loader size='big' />}>
                    <CreateProject />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path='create-project/:id' element={
                <ProtectedRoute>
                  <Suspense fallback={<Loader size='big' />}>
                    <CreateProject />
                  </Suspense>
              </ProtectedRoute>
              } />
              <Route path='chat' element={
                <ProtectedRoute>
                  <Groups />
                </ProtectedRoute>
              } />
              <Route path='*' element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </Router>
      </>
    }
  </div>)
}

export default App
