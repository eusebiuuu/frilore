import { Link } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie, 
  PieChart, 
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

const data = [
  {
    "name": "Project A",
    "value": 400
  },
  {
    "name": "Project B",
    "value": 300
  },
  {
    "name": "Project C",
    "value": 300
  },
  {
    "name": "Project D",
    "value": 200
  },
  {
    "name": "Project E",
    "value": 278
  },
  {
    "name": "Project F",
    "value": 189
  }
];

export default function Dashboard() {
  return (
    <div className='p-6 w-full'>
      <div className='w-full flex justify-between px-8 py-6'>
        <h2 className=''>Dashboard</h2>
        <Link to='/create-project' className='bg-primary px-4 py-2 rounded hover:shadow-md'>New project</Link>
      </div>
      <div className='p-6 bg-white rounded-md w-full'>
        <h3 className='mb-3'>Work throughout the last year</h3>
        <div className='p-4 border-solid border-gray-300 border-2 w-full'>
          <ResponsiveContainer width='100%' height={250}>
            <LineChart data={[{name: 'Data 1', value: 12, diff: 5},
              {name: 'Data 2', value: 18, diff: 7}, {name: 'Data 3', value: 18, diff: 2},
              {name: 'Data 4', value: 24, diff: 4}]}>
              <CartesianGrid strokeDasharray={'3 3'} />
              <XAxis dataKey={'name'} />
              <YAxis dataKey={'value'} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="name" stroke="#8884d8" />
              <Line type="monotone" dataKey="value" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className='flex justify-around mt-4'>
        <div className='p-6 bg-white rounded-md w-1/2 mr-2'>
          <h3>Tasks per projects</h3>
          <ResponsiveContainer width={'100%'} height={300}>
            <PieChart>
              <Pie data={data} dataKey={'value'} nameKey={'name'} label>
                {
                  data.map((_, idx) => {
                    return (
                      <Cell key={idx} fill={`${idx % 2 === 0 ? '#f95959' : '#5585b5'}`} />
                    )
                  })
                }
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className='p-6 bg-white rounded-md w-1/2 ml-2'>
          <h3>Tasks status</h3>
          <ResponsiveContainer width={'100%'} height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={'value'} />
              <Tooltip />
              <Legend />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}