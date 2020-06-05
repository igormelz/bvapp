import axios from "axios";

// format date
export const fmtDate = (str) => {
  const d = new Date(str);
  return d.toLocaleDateString();
};

// get and download file
export const downloadFile = async (url) => {
  const fileName = url.substring(url.lastIndexOf("/") + 1);
  const { data } = await axios.get(url, { responseType: "blob" });
  const blob = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement("a");
  link.href = blob;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  link.parentNode.removeChild(link);
};
