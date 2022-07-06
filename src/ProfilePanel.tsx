import { FunctionComponent, useEffect, useState } from "react";
import { FoafProfile } from "./ldo/foafProfile.typings";
import { FoafProfileFactory } from "./ldo/foafProfile.ldoFactory";

const ProfilePanel: FunctionComponent<{ webId: string }> = ({ webId }) => {
  const [profile, setProfile] = useState<FoafProfile | undefined>();
  useEffect(() => {
    async function fetchProfile() {
      const rawProfile = await (
        await fetch(webId)
      ).text();
      const foafProfile = await FoafProfileFactory.parse(
        webId,
        rawProfile,
        { baseIRI: webId }
      );
      setProfile(foafProfile);
    }
    fetchProfile();
  })

  return (
    <>
      <h2>Profile Panel</h2>
      {profile ? (<>
        <p>Name: {profile.name}</p>
        <p>Image: <img style={{ height: 200 }} src={profile.img} alt="Profile" /></p>
        <p>Knows:</p>
        <ul>
          {profile.knows?.map((friend) => {
            return <li key={friend["@id"]}>{friend["@id"]}</li>
          })}
        </ul>
      </>) : undefined}
    </>
  );
}

export default ProfilePanel;
