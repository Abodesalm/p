import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const mySwal = withReactContent(Swal);

export default function Popup(
  {
    title,
    agreeStyle = "prime",
    agreeText = "agree",
    agreeAction,
    cancelStyle = "normal",
    cancelText = "cancel",
  } /* :{
  title: ReactNode;
  agreeStyle: String;
  agreeText: String;
  agreeAction: Function;
  cancelStyle: String;
  cancelText: String;
} */
) {
  const styling = (type) => {
    if (type === "normal") return " btn-normal ";
    else if (type === "prime") return " btn-prime ";
    else if (type === "danger") return " btn-danger ";
    else if (type === "success") return " btn-success ";
    else if (type === "outline") return " btn-outline ";
    else if (type === "outline-prime") return " btn-outline-prime ";
    else if (type === "outline-danger") return " btn-outline-danger ";
    else if (type === "outline-success") return " btn-outline-success ";
  };
  mySwal
    .fire({
      title: title,
      showCancelButton: true,
      confirmButtonText: agreeText,
      cancelButtonText: cancelText,
      customClass: {
        popup: "bg-light dark:bg-dark/80",
        cancelButton: styling(cancelStyle),
        confirmButton: styling(agreeStyle),
        title: "text-size-3 text-dark dark:text-light",
      },
    })
    .then((data) => {
      if (data.isConfirmed) {
        agreeAction();
      }
    });
}
