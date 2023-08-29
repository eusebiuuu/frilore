import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import FixedSidebar from "./components/FixedSidebar"
import Footer from "./components/Footer"
import Projects from "./features/projects/Projects"
import SingleProject from "./features/projects/SingleProject"
import MobileSidebar from "./components/MobileSidebar"
import AssignedTasks from "./features/tasks/AssignedTasks"
import PersonalProfile from "./features/profile/PersonalProfile"
import ForeignProfile from "./features/profile/ForeignProfile"
import Register from "./features/authentication/Register"
import Login from "./features/authentication/Login"
import Home from "./features/home/Home"
import CreateProject from "./features/projects/CreateProject"
import Dashboard from "./features/dashboard/Dashboard"
import { ToastContainer } from "react-toastify"
import 'react-toastify/dist/ReactToastify.css';
import Groups from "./features/chat/Groups"
import { useUserContext } from "./context/user"
import Loader from "./components/Loader"
import ProtectedRoute from "./components/ProtectedRoute"

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
                : <Home />
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
                  <SingleProject />
                </ProtectedRoute>
              } />
              <Route path='tasks' element={
                <ProtectedRoute>
                  <AssignedTasks />
                </ProtectedRoute>
              } />
              <Route path='profile' element={
                <ProtectedRoute>
                  <PersonalProfile />
                </ProtectedRoute>
              } />
              <Route path='profile/:id' element={
                <ProtectedRoute>
                  <ForeignProfile />
                </ProtectedRoute>
              } />
              <Route path='create-project' element={
                <ProtectedRoute>
                  <CreateProject />
                </ProtectedRoute>
              } />
              <Route path='create-project/:id' element={
                <ProtectedRoute>
                  <CreateProject />
                </ProtectedRoute>
              } />
              <Route path='chat' element={
                <ProtectedRoute>
                  <Groups />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
          <Footer />
        </Router>
      </>
    }
  </div>)
}

export default App
