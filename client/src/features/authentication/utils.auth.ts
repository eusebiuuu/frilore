import customFetch from "../../lib/customFetch";
import { catchAxiosError } from "../../utils/utils";

export const tailwindClasses = 'w-96 block px-4 py-3 my-4 bg-white rounded-2xl m-auto font-semibold text-lg hover:shadow-md';

export async function thirdPartySignUp(name: string) {
  try {
    await customFetch.get(`/auth/${name}`);
  } catch (err) {
    catchAxiosError(err);
  }
}