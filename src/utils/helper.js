import axios from "axios";

// format date
export const fmtDate = (str) => {
  const d = new Date(str);
  return d.toLocaleDateString('ru-RU');
};

// format date as year
export const fmtYear = (str) => {
  const d = new Date(str);
  return d.getFullYear();
};

// dec to dms 
export const todms = (d) => {
    var g = Math.floor(d);
    var m = ((d - g) * 60).toFixed(2);
    return (g + " " + m);
}

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
