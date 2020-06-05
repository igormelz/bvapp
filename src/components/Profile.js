import React, { Fragment, useState, useEffect } from "react";
import { useKeycloak } from "@react-keycloak/web";

const Profile = () => {
  const { keycloak, initialized } = useKeycloak();
  const [userInfo, setUserInfo] = useState();

  useEffect(() => {
    const getProfile = async () => {
      const profile = await keycloak.loadUserProfile();
      setUserInfo(JSON.stringify(profile));
      //setUserToken(keycloak.realmAccess.roles.indexOf("admin"));
    };
    getProfile();
    // eslint-disable-next-line
  }, []);

  if (!initialized) {
    return <div>Loading...</div>;
  }

  return (
    <Fragment>
      <div>
        <p>
          UserInfo:
          <code>{userInfo}</code>
        </p>
      </div>
    </Fragment>
  );
};

export default Profile;
