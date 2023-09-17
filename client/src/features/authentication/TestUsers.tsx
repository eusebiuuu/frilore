import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/user"
import { tailwindClasses } from "./utils.auth";
import { useState } from "react";

export default function TestUsers() {
  const { login } = useUserContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean[]>([false, false, false]);

  async function handleTestUserLogin(num: number) {
    setLoading(oldVal => {
      return oldVal.map((_, idx) => idx === num ? true : false)
    })
    await login('123456', `test_user_${num}`);
    setLoading([false, false, false]);
    navigate('/');
  }

  return (
    <div>
      {
        [1, 2, 3].map(elem => {
          return (
            <button
              key={elem}
              onClick={() => handleTestUserLogin(elem)}
              className={`${tailwindClasses}`}
              disabled={loading[elem]}
            >
              { loading[elem] ? 'Loading...' :  `Test account - ${elem}` }
            </button>
          )
        })
      }
    </div>
  )
}