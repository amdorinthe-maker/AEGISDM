export const COMPENDIUM_DATA = [
  // --- ACTIONS ---
  { cat: "Action", name: "Attack", effect: "Make one melee or ranged attack." },
  { cat: "Action", name: "Dash", effect: "Gain extra movement equal to your speed." },
  { cat: "Action", name: "Disengage", effect: "Prevent opportunity attacks for the turn." },
  { cat: "Action", name: "Dodge", effect: "Attacks against you have Disadv; DEX saves have Adv." },
  { cat: "Action", name: "Help", effect: "Give an ally Adv on their next check or attack." },
  { cat: "Action", name: "Hide", effect: "Make a Stealth check to become unseen." },
  { cat: "Action", name: "Ready", effect: "Choose a trigger to take an action later." },
  { cat: "Action", name: "Search", effect: "Make a Perception or Investigation check." },
  { cat: "Action", name: "Use Object", effect: "Interact with a second object or special item." },

  // --- CONDITIONS ---
  { cat: "Condition", name: "Blinded", effect: "Fails sight checks. Attacks against have Adv; creature's attacks have Disadv." },
  { cat: "Condition", name: "Charmed", effect: "Can't attack charmer. Charmer has Adv on social checks." },
  { cat: "Condition", name: "Deafened", effect: "Fails hearing checks." },
  { cat: "Condition", name: "Exhaustion", effect: "1: Disadv Checks | 2: Speed Half | 3: Disadv Atk/Save | 4: HP Half | 5: Speed 0 | 6: Death" },
  { cat: "Condition", name: "Frightened", effect: "Disadv checks/attacks while source is in sight. Can't move closer." },
  { cat: "Condition", name: "Grappled", effect: "Speed 0. Ends if grappler is incapacitated." },
  { cat: "Condition", name: "Incapacitated", effect: "Cannot take actions or reactions." },
  { cat: "Condition", name: "Invisible", effect: "Attacks against have Disadv; creature's attacks have Adv." },
  { cat: "Condition", name: "Paralyzed", effect: "Incapacitated. Fails STR/DEX saves. Melee attacks are auto-crits." },
  { cat: "Condition", name: "Petrified", effect: "Stone. Weight x10. Incapacitated. Resistance to all damage." },
  { cat: "Condition", name: "Poisoned", effect: "Disadvantage on attack rolls and ability checks." },
  { cat: "Condition", name: "Prone", effect: "Speed 0. Disadv attacks. Adv against within 5ft." },
  { cat: "Condition", name: "Restrained", effect: "Speed 0. Attacks against have Adv; creature's attacks have Disadv." },
  { cat: "Condition", name: "Stunned", effect: "Incapacitated. Fails STR/DEX saves. Attacks against have Adv." },
  { cat: "Condition", name: "Unconscious", effect: "Incapacitated. Drops items. Prone. Melee attacks are auto-crits." },

  // --- ENVIRONMENT & OBJECTS ---
  { cat: "Object", name: "Object AC", effect: "Cloth (11), Wood (15), Stone (17), Iron (19), Adamantine (23)" },
  { cat: "Object", name: "Object HP", effect: "Tiny: 2-5 | Small: 3-10 | Medium: 4-18 | Large: 5-27" },
  { cat: "Cover", name: "Half Cover", effect: "+2 bonus to AC and DEX saves." },
  { cat: "Cover", name: "3/4 Cover", effect: "+5 bonus to AC and DEX saves." },
  { cat: "Cover", name: "Total Cover", effect: "Cannot be targeted by attacks or spells." }
];