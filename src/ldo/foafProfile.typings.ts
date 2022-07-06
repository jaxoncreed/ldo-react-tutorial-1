import { ContextDefinition } from "jsonld";

/**
 * =============================================================================
 * Typescript Typings for foafProfile
 * =============================================================================
 */

/**
 * FoafProfile Type
 */
export interface FoafProfile {
  "@id"?: string;
  "@context"?: ContextDefinition;
  /**
   * Defines the node as a Person (from foaf)
   */
  type: "Person";
  /**
   * Define a person's name.
   */
  name?: string;
  /**
   * Photo link but in string form
   */
  img?: string;
  /**
   * A list of WebIds for all the people this user knows.
   */
  knows?: FoafProfile[];
}
