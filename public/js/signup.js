import { axios } from "axios";
import { showAlert } from "./alert";
export const signup = async function (data) {
  try {
    const res = await axios({
      method: "POST",
      url: "/api/v1/users",
      data: data
    });
    console.log(res);
    console.log(res.response, "response...");
  } catch (err) {
    showAlert('danger', err.message);
  }
}
