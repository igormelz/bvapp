import React, { useCallback, useState } from "react";
import { useAuthApi } from "../utils/authApi";

function PingApi() {
  const [userInfo, setUserInfo] = useState(null);
  const axiosInstance = useAuthApi();

  const callApi = useCallback(() => {
    axiosInstance
      .get("/secure/me")
      .then((response) => {
        //console.log(response.data);
        setUserInfo(JSON.stringify(response.data));
      })
      .catch(() => console.log("ERROR"));
  }, [axiosInstance]);

  return (
    <div>
      <button type="button" onClick={callApi}>
        Call API
      </button>
      {userInfo && (
        <div>
          <p>User data: <code>{userInfo}</code></p>
        </div>
      )}
    </div>
  );
}

export default PingApi;
