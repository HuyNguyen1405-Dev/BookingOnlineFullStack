import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const toastMessage = (type, message) => {
  console.log("Huy test", type);
  switch (type) {
    case "success":
      toast.success(message, {
        position: "top-right",
        autoClose: 4000,
        pauseOnHover: true,
        draggable: true,
        // theme: "dark",
      });
      break;
    case "error":
      toast.error(message, {
        position: "top-right",
        autoClose: 4000,
        pauseOnHover: true,
        draggable: true,
      });
      break;
    default:
      break;
  }
};

export default toastMessage;
