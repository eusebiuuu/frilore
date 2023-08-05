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
import Chat from "./features/chat/Chat"
import Dashboard from "./features/dashboard/Dashboard"

/*
- Lazy import
*/

function App() {
  return (
    <Router>
      <Navbar />
      <div className="flex max-w-full">
        <FixedSidebar />
        <MobileSidebar />
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path='home' element={<Home />} />
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
          <Route path='projects' element={<Projects />} />
          <Route path='projects/:id' element={<SingleProject />} />
          <Route path='tasks' element={<AssignedTasks />} />
          <Route path='profile' element={<ForeignProfile />} />
          <Route path='profile/personal' element={<PersonalProfile />} />
          <Route path='create-project' element={<CreateProject />} />
          <Route path='chat' element={<Chat />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  )
}

export default App
