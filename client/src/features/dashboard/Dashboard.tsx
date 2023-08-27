import { Link } from "react-router-dom";
import { Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip,
  XAxis, YAxis } from "recharts";
import { colours, getProjectsData, getTaskData, getTaskStatusData } from "./utils.dashboard";
import { useEffect, useState } from "react";
import { Task } from "../projects/utils.project";
import customFetch from "../../lib/customFetch";
import { catchAxiosError } from "../../utils/utils";
import Loader from "../../components/Loader";

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[] | []>([]);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<{ name: string, total_tasks: string }[] | []>([]);

  useEffect(() => {
    (async () => {
      try {
        const result = await customFetch.get('/task');
        setTasks(result.data.tasks || []);
        const projects = await customFetch.get('/project/tasks');
        setProjects(projects.data.projects || []);
      } catch (err) {
        catchAxiosError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  return (
    <div className='p-6 md:w-[calc(100%-16rem)] sm:w-full'>
      {
        loading
        ? <Loader size='big' />
        : <>
          <div className='w-full flex justify-between py-6'>
            <h2 className=''>Dashboard</h2>
            <Link to='/create-project' className='bg-primary px-4 py-2 rounded hover:shadow-md'>New project</Link>
          </div>
          <div className='my-6 p-6 bg-white rounded-md w-full'>
            <h3 className='mb-3'>Work throughout the last year</h3>
            <div className='p-4 border-solid border-gray-300 border-2 w-full'>
              <ResponsiveContainer height={250}>
                <LineChart data={getTaskData(tasks) as unknown as any[]}>
                  <CartesianGrid strokeDasharray={'3 3'} />
                  <XAxis dataKey={'month'} />
                  <YAxis dataKey={'count'} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="month" stroke="#8884d8" />
                  <Line type="monotone" dataKey="count" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className='p-6 my-6 bg-white rounded-md w-full'>
            <h3>Assigned tasks per project</h3>
            <div className='p-4 border-solid border-gray-300 border-2 w-full'>
              <ResponsiveContainer height={300}>
                <PieChart>
                  <Pie data={getProjectsData(projects) as any[]} dataKey={'value'} nameKey={'name'} label>
                    {
                      getProjectsData(projects).map((_, idx) => {
                        return (
                          <Cell key={idx} fill={colours[idx % colours.length]} />
                        )
                      })
                    }
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className='my-6 p-6 bg-white rounded-md w-full'>
            <h3>Tasks status</h3>
            <div className='p-4 border-solid border-gray-300 border-2 w-full'>
              <ResponsiveContainer height={300}>
                <BarChart data={getTaskStatusData(tasks)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey='high' fill={'#ff4d4d'} />
                  <Bar dataKey='low' fill={'#4db8ff'} />
                  <Tooltip />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      }
    </div>
  )
}