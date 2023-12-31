import { useEffect, useState } from "react"
import Members from "../../components/Members";
import { Link } from "react-router-dom";
import { FiSearch } from 'react-icons/fi'
import customFetch from "../../lib/customFetch";
import { catchAxiosError } from "../../utils/catchAxiosError";
import { ProjectsWithMembers } from "../projects/utils.project";
import Loader from "../../components/Loader";
import { getFullDate } from "../tasks/utils.tasks";
import { getNonEmptyContent } from "../../utils/emptyValue";

export default function Projects() {
  const [criteria, setCriteria] = useState('oldest first');
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<ProjectsWithMembers>([]);
  const [shownProjects, setShownProjects] = useState<ProjectsWithMembers>([]);
  const [keyword, setKeyword] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const result = await customFetch.get('/project/members/all');
        setProjects(result.data.projects);
        setShownProjects(result.data.projects);
      } catch (err) {
        catchAxiosError(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    setShownProjects(projects.filter(elem => {
      if (elem.name.toLowerCase().includes(keyword) || elem.description.toLowerCase().includes(keyword)) {
        return elem;
      }
    }).sort((a, b) => {
      if (criteria === 'oldest first') {
        return a.created_at < b.created_at ? -1 : 1;
      } else if (criteria === 'newest first') {
        return a.created_at < b.created_at ? 1 : -1;
      } else if (criteria === 'alphabetical') {
        return a.name < b.name ? -1 : 1;
      }
      return b.members.length - a.members.length;
    }));
  }, [keyword, criteria]);

  return (
    <div className='p-10 w-full'>
      {
        loading
        ? <Loader size='big' />
        : <>
          <div className='w-full mb-12'>
            <div className='mb-4 text-right'>
              <select value={criteria} onChange={e => setCriteria(e.target.value)}
                className='bg-green-200 text-green-800 focus:border-none outline-none'>
                <option value='oldest first'>Oldest first</option>
                <option value='newest first'>Newest first</option>
                <option value='alphabetical'>Alphabetical order</option>
                <option value='most members'>Most members</option>
              </select>
            </div>
            <div className='text-center m-auto border-2 flex place-content-center rounded-md w-fit bg-white'>
              <FiSearch size={30} className='pt-2 pl-2' />
              <input placeholder='Search projects' className='w-80' value={keyword}
                onChange={(e) => setKeyword(e.target.value)} />
            </div>
          </div>
          {
            shownProjects.length === 0
            ? <h2>No project matched your search</h2>
            : <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4'>
              {
                shownProjects.map(elem => {
                  return <Link to={`/projects/${elem.project_id}`} key={elem.project_id}
                    className='p-4 bg-white shadow-md rounded-lg hover:bg-gray-200 transition-all'>
                    <h3>{getNonEmptyContent(elem.name, 'No title provided')}</h3>
                    <hr />
                    <p className='py-4'>{elem.description}</p>
                    <div className='flex justify-between'>
                      <Members members={elem.members} />
                      <div className='grid place-items-center'>
                        Created on {getFullDate(elem.created_at)}
                      </div>
                    </div>
                  </Link>
                })
              }
            </div>
          }
        </>
      }
    </div>
  )
}