import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/user"
import { tailwindClasses } from "./utils.auth";

export default function TestUsers() {
  const { login } = useUserContext();
  const navigate = useNavigate();

  async function handleTestUserLogin(num: number) {
    await login('123456', `test_user_${num}`);
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
            >
              {`Test user account - ${elem}`}
            </button>
          )
        })
      }
    </div>
  )
}