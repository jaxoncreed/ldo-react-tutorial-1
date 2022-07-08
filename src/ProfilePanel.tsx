import { FormEvent, FunctionComponent, useCallback, useEffect, useState } from "react";
import { LinkedDataObject } from "ldo";
import { FoafProfile } from "./ldo/foafProfile.typings";
import { FoafProfileFactory } from "./ldo/foafProfile.ldoFactory";
import { fetch } from "@inrupt/solid-client-authn-browser";

const ProfilePanel: FunctionComponent<{ webId: string }> = ({ webId }) => {
  const [profile, setProfile] = useState<LinkedDataObject<FoafProfile> | undefined>();
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
      setNameField(foafProfile.name || "");
    }
    fetchProfile();
  }, [webId]);

  const [nameField, setNameField] = useState<string>("");
  const onSubmitNameChange = useCallback(async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (profile) {
      const modifiedProfile = profile.$clone();
      modifiedProfile.name = nameField;
      const response = await fetch(webId, {
        method: "PATCH",
        body: await modifiedProfile.$toSparqlUpdate(),
        headers: {
          "Content-Type": "application/sparql-update"
        }
      });
      if (response.status === 200) {
        setProfile(modifiedProfile);
      }
    }
  }, [profile, nameField, webId]);

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
        <form onSubmit={onSubmitNameChange}>
          <label>Profile Name</label>
          <input type="text" value={nameField} onChange={(e) => setNameField(e.target.value)} />
          <input type="submit" value="Change Name" />
        </form>
      </>) : undefined}
    </>
  );
}

export default ProfilePanel;
