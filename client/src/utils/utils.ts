import axios from "axios";
import { toast } from "react-toastify";
// import customFetch from "../lib/customFetch";

export function catchAxiosError(err: unknown) {
  if (axios.isAxiosError(err)) {
    toast.error(err.response?.data.msg);
  } else {
    console.error(err);
  }
}